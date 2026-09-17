import {
  DEFAULT_STUDENT_PROFILE,
  DEFAULT_STUDENT_RESUME,
  INITIAL_STUDENT_APPLICATIONS,
  INITIAL_STUDENT_INTERVIEWS,
  STUDENT_CAREER_ROLES,
  STUDENT_SKILL_GAP_DATA,
  INITIAL_STUDENT_NOTIFICATIONS,
} from "../data/studentMockData.js";
import {
  getJobs as getCompanyJobs,
  getJobById as getCompanyJobById,
  getApplicants as getCompanyApplicants,
  saveApplicants as saveCompanyApplicants,
} from "./companyService.js";

const STORAGE_KEYS = {
  PROFILE: "git_careerai_student_profile",
  RESUME: "git_careerai_student_resume",
  APPLICATIONS: "git_careerai_student_applications",
  INTERVIEWS: "git_careerai_student_interviews",
  NOTIFICATIONS: "git_careerai_student_notifications",
  VERSION: "git_careerai_student_version",
};

const DATA_VERSION = "2.2";

function checkStorageVersion() {
  try {
    const current = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (current !== DATA_VERSION) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_STUDENT_PROFILE));
      localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(DEFAULT_STUDENT_RESUME));
      localStorage.setItem(
        STORAGE_KEYS.APPLICATIONS,
        JSON.stringify(INITIAL_STUDENT_APPLICATIONS)
      );
      localStorage.setItem(
        STORAGE_KEYS.INTERVIEWS,
        JSON.stringify(INITIAL_STUDENT_INTERVIEWS)
      );
      localStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(INITIAL_STUDENT_NOTIFICATIONS)
      );
      localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
    } else {
      // Ensure any cached legacy name is updated
      const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (rawProfile && rawProfile.includes("Shaikh")) {
        const prof = JSON.parse(rawProfile);
        prof.fullName = "Bilal Madre";
        prof.name = "Bilal Madre";
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(prof));
      }
      const rawResume = localStorage.getItem(STORAGE_KEYS.RESUME);
      if (rawResume && rawResume.includes("Shaikh")) {
        const res = JSON.parse(rawResume);
        res.fileName = "Bilal_Madre_Resume.pdf";
        localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(res));
      }
    }
  } catch {
    // Ignore storage issues in private browsing
  }
}
checkStorageVersion();

const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("StudentService listener error", e);
    }
  });
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---------------------------------------------------------------------------
// Student Profile
// ---------------------------------------------------------------------------
export function getStudentProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return DEFAULT_STUDENT_PROFILE;
}

export function updateStudentProfile(updates) {
  const current = getStudentProfile();
  const updated = { ...current, ...updates };
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  // Cross-module sync: Update Admin Student Directory
  try {
    const rawStudents = localStorage.getItem("git_careerai_admin_students");
    if (rawStudents) {
      const students = JSON.parse(rawStudents);
      const updatedStudents = students.map((s) => {
        const matchRoll = s.rollNo === updated.rollNo || s.rollNo === "22CE1045";
        const matchEmail =
          s.email === updated.email ||
          s.email === "demo@git.edu" ||
          s.email === "student@git.edu";
        if (matchRoll || matchEmail) {
          return {
            ...s,
            name: updated.fullName || s.name,
            cgpa: typeof updated.cgpa === "number" ? updated.cgpa : s.cgpa,
            branch: updated.branch || s.branch,
            backlogs: typeof updated.backlogs === "number" ? updated.backlogs : s.backlogs,
            phone: updated.phone || s.phone,
          };
        }
        return s;
      });
      localStorage.setItem("git_careerai_admin_students", JSON.stringify(updatedStudents));
    }
  } catch {
    // Ignore
  }

  emitChange();
  return updated;
}

// ---------------------------------------------------------------------------
// Resume Management
// ---------------------------------------------------------------------------
export function getResumeData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESUME);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return DEFAULT_STUDENT_RESUME;
}

export function uploadResume(meta) {
  const current = getResumeData();
  const now = new Date();
  const updated = {
    ...current,
    hasResume: true,
    fileName: meta.fileName || "Uploaded_Resume.pdf",
    fileSize: meta.fileSize || "350 KB",
    uploadedAt: now.toISOString(),
    uploadedAtLabel: now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    atsScore: meta.atsScore || 85,
  };
  try {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  // Add notification
  addStudentNotification({
    title: "Resume Uploaded Successfully",
    message: `Your resume "${updated.fileName}" was uploaded and scanned for placement ATS compatibility (Score: ${updated.atsScore}%).`,
    category: "system",
    link: "/resume",
  });

  emitChange();
  return updated;
}

export function removeResume() {
  const updated = {
    hasResume: false,
    fileName: "",
    fileSize: "",
    uploadedAt: "",
    uploadedAtLabel: "",
    atsScore: 0,
    scoreBreakdown: { formatting: 0, skillsMatch: 0, experience: 0, education: 0 },
    strengths: [],
    improvements: [],
  };
  try {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
  return updated;
}

// ---------------------------------------------------------------------------
// Jobs & Eligibility (Single Source of Truth with companyService)
// ---------------------------------------------------------------------------
export function getStudentJobs() {
  let unverifiedCompanyNames = new Set();
  try {
    const rawCompanies = localStorage.getItem("git_careerai_admin_companies");
    if (rawCompanies) {
      const comps = JSON.parse(rawCompanies);
      comps.forEach((c) => {
        if (c.status === "Pending Verification" || c.status === "Rejected") {
          unverifiedCompanyNames.add((c.name || "").toLowerCase());
        }
      });
    }
  } catch {
    // Ignore
  }

  const companyJobs = getCompanyJobs().filter(
    (job) =>
      (job.status === "Active" || job.status === "Closed") &&
      !unverifiedCompanyNames.has((job.company || "").toLowerCase())
  );
  const profile = getStudentProfile();
  const applications = getStudentApplications();

  return companyJobs.map((job) => {
    const isApplied = applications.some((app) => app.jobId === job.id);
    const existingApp = applications.find((app) => app.jobId === job.id);

    // Calculate student eligibility
    const passesCgpa = (profile.cgpa || 0) >= (job.minCgpa || 0);
    const passesBacklogs = (profile.backlogs || 0) <= (job.allowedBacklogs || 0);
    const passesBranch =
      !job.allowedBranches ||
      job.allowedBranches.length === 0 ||
      job.allowedBranches.includes(profile.branch);

    const isEligible = passesCgpa && passesBacklogs && passesBranch;

    return {
      ...job,
      isApplied,
      appliedStatus: existingApp ? existingApp.status : null,
      isEligible,
      eligibilityReasons: {
        cgpa: { passes: passesCgpa, required: job.minCgpa, student: profile.cgpa },
        branch: { passes: passesBranch, allowed: job.allowedBranches, student: profile.branch },
        backlogs: {
          passes: passesBacklogs,
          maxAllowed: job.allowedBacklogs,
          student: profile.backlogs,
        },
      },
    };
  });
}

export function getStudentJobById(id) {
  const jobs = getStudentJobs();
  return jobs.find((j) => String(j.id) === String(id)) || null;
}

// ---------------------------------------------------------------------------
// Applications Management
// ---------------------------------------------------------------------------
export function getStudentApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return INITIAL_STUDENT_APPLICATIONS;
}

export function applyToJob(jobId) {
  const numericId = Number(jobId);
  const companyJob = getCompanyJobById(numericId);
  if (!companyJob) {
    return { success: false, error: "Job opening not found." };
  }

  // FIX #10: Lifecycle check - closed/pending/draft/rejected jobs cannot accept applications
  if (companyJob.status !== "Active") {
    return {
      success: false,
      error: `This job opening is ${companyJob.status ? companyJob.status.toLowerCase() : "inactive"} and is no longer accepting new applications.`,
    };
  }

  // FIX #4: Unverified company check
  try {
    const rawCompanies = localStorage.getItem("git_careerai_admin_companies");
    if (rawCompanies) {
      const comps = JSON.parse(rawCompanies);
      const matchedCompany = comps.find(
        (c) => c.name?.toLowerCase() === companyJob.company?.toLowerCase()
      );
      if (matchedCompany && (matchedCompany.status === "Pending Verification" || matchedCompany.status === "Rejected")) {
        return {
          success: false,
          error: "Applications for this recruiter are currently restricted pending institutional verification.",
        };
      }
    }
  } catch {
    // Ignore
  }

  const applications = getStudentApplications();
  if (applications.some((a) => a.jobId === numericId)) {
    return { success: false, error: "You have already applied for this job." };
  }

  // FIX #11: Resume requirement
  const resume = getResumeData();
  if (!resume || !resume.hasResume) {
    return {
      success: false,
      error: "Please upload your resume before applying for campus job openings.",
      requiresResume: true,
    };
  }

  // Validate deadline
  if (companyJob.deadline) {
    const deadlineDate = new Date(companyJob.deadline);
    if (!isNaN(deadlineDate.getTime())) {
      deadlineDate.setHours(23, 59, 59, 999);
      if (new Date() > deadlineDate) {
        return {
          success: false,
          error: "The application deadline for this position has passed.",
        };
      }
    }
  }

  // Validate eligibility
  const profile = getStudentProfile();
  const passesCgpa = (profile.cgpa || 0) >= (companyJob.minCgpa || 0);
  const passesBacklogs = (profile.backlogs || 0) <= (companyJob.allowedBacklogs ?? 0);
  const passesBranch =
    !companyJob.allowedBranches ||
    companyJob.allowedBranches.length === 0 ||
    companyJob.allowedBranches.includes(profile.branch);

  if (!passesCgpa || !passesBacklogs || !passesBranch) {
    return {
      success: false,
      error: "You do not meet the academic eligibility criteria required by this recruiter.",
    };
  }

  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // FIX #9: Consistent shared identifiers across modules
  const appId = `app-${Date.now()}`;
  const studentId = profile.id || "student-001";
  const companyId = companyJob.companyId || (companyJob.company?.toLowerCase().includes("tcs") ? "comp-1" : `comp-${numericId}`);

  const newApp = {
    id: appId,
    applicationId: appId,
    studentId,
    companyId,
    jobId: numericId,
    company: companyJob.company || "Tata Consultancy Services (TCS)",
    role: companyJob.title,
    location: companyJob.location,
    ctc: companyJob.ctc,
    workMode: companyJob.workMode,
    appliedDate: dateLabel,
    appliedDateLabel: dateLabel,
    status: "Applied",
    interviewDate: null,
    interviewDateLabel: null,
    interviewMode: null,
    interviewRound: null,
  };

  const updatedApps = [newApp, ...applications];
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updatedApps));
  } catch {
    // Ignore
  }

  // SYNC WITH COMPANY PORTAL (Single Source of Truth!)
  try {
    const companyApplicants = getCompanyApplicants();
    const newCompanyApplicant = {
      id: `cand-${Date.now()}`,
      applicationId: appId,
      studentId,
      companyId,
      jobId: numericId,
      name: profile.fullName || "Bilal Madre",
      email: profile.email || "student@git.edu",
      phone: profile.phone || "+91 98234 56789",
      role: companyJob.title,
      branch: profile.branch || "Computer Engineering",
      cgpa: profile.cgpa || 8.7,
      graduationYear: profile.graduationYear || "2026",
      atsScore: resume.atsScore || 85,
      eligible: true,
      appliedDate: dateLabel,
      status: "Applied",
      skills: profile.technicalSkills || ["Java", "SQL", "Git"],
      college: profile.college || "Gharda Institute of Technology",
    };
    saveCompanyApplicants([newCompanyApplicant, ...companyApplicants]);
  } catch (err) {
    console.error("Error syncing student application with company portal", err);
  }

  // SYNC WITH ADMIN PORTAL (Central Applications Monitor)
  try {
    const rawAdminApps = localStorage.getItem("git_careerai_admin_applications");
    const adminApps = rawAdminApps ? JSON.parse(rawAdminApps) : [];
    const newAdminApp = {
      id: `capp-${Date.now()}`,
      applicationId: appId,
      studentId,
      companyId,
      jobId: numericId,
      studentName: profile.fullName || "Bilal Madre",
      rollNo: profile.rollNo || "22CE1045",
      branch: profile.branch || "Computer Engineering",
      cgpa: profile.cgpa || 8.7,
      company: companyJob.company || "Tata Consultancy Services (TCS)",
      role: companyJob.title,
      appliedDate: dateLabel,
      status: "Applied",
      atsScore: resume.atsScore || 85,
      eligible: true,
    };
    localStorage.setItem(
      "git_careerai_admin_applications",
      JSON.stringify([newAdminApp, ...adminApps])
    );
  } catch (err) {
    console.error("Error syncing with admin applications", err);
  }

  // Add notification
  addStudentNotification({
    title: `Application Submitted: ${companyJob.title}`,
    message: `Your application has been received for ${companyJob.title} at ${
      companyJob.company || "TCS"
    }. The recruiter will review your profile.`,
    category: "application",
    link: "/applications",
  });

  emitChange();
  return { success: true, application: newApp };
}

// ---------------------------------------------------------------------------
// Interviews
// ---------------------------------------------------------------------------
export function getStudentInterviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return INITIAL_STUDENT_INTERVIEWS;
}

// ---------------------------------------------------------------------------
// Career & Skill Gap
// ---------------------------------------------------------------------------
export function getCareerRecommendations() {
  return STUDENT_CAREER_ROLES;
}

export function getSkillGapData() {
  return STUDENT_SKILL_GAP_DATA;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export function getStudentNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return INITIAL_STUDENT_NOTIFICATIONS;
}

export function addStudentNotification(notif) {
  const current = getStudentNotifications();
  if (current.length > 0 && current[0].title === notif.title && current[0].timestamp === "Just now") {
    return current[0];
  }
  const newNotif = {
    id: `snotif-${Date.now()}`,
    timestamp: "Just now",
    read: false,
    ...notif,
  };
  const updated = [newNotif, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
  return newNotif;
}

export function markStudentNotificationRead(id) {
  const current = getStudentNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
}

export function markAllStudentNotificationsRead() {
  const current = getStudentNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
}
