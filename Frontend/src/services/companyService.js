import {
  DEFAULT_COMPANY_PROFILE,
  INITIAL_COMPANY_JOBS,
  INITIAL_APPLICANTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
} from "../data/companyMockData.js";

const STORAGE_KEYS = {
  PROFILE: "git_careerai_company_profile",
  JOBS: "git_careerai_company_jobs",
  APPLICANTS: "git_careerai_company_applicants",
  NOTIFICATIONS: "git_careerai_company_notifications",
  ACTIVITIES: "git_careerai_company_activities",
};

const DATA_VERSION = "2.4";
const VERSION_KEY = "git_careerai_company_version";

function checkStorageVersion() {
  try {
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (currentVersion !== DATA_VERSION) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_COMPANY_JOBS));
      localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(INITIAL_APPLICANTS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_COMPANY_PROFILE));
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
    } else {
      const rawApplicants = localStorage.getItem(STORAGE_KEYS.APPLICANTS);
      if (rawApplicants && rawApplicants.includes("Shaikh")) {
        const apps = JSON.parse(rawApplicants).map((a) =>
          a.email === "student@git.edu" || a.email === "demo@git.edu" || a.name?.includes("Shaikh")
            ? { ...a, name: "Bilal Madre" }
            : a
        );
        localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(apps));
      }
    }
  } catch {
    // ignore
  }
}
checkStorageVersion();

const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("Listener error", e);
    }
  });
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ---------------- Helper reading/writing ---------------- //

function readStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write to localStorage key ${key}:`, err);
  }
}

function attachJobCounts(jobs) {
  const applicants = readStorage(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
  return jobs.map((job) => {
    const jobApplicants = applicants.filter((a) => String(a.jobId) === String(job.id));
    const eligibleCount = jobApplicants.filter((a) => a.eligible).length;
    const shortlistedCount = jobApplicants.filter((a) =>
      ["Shortlisted", "Interview", "Selected"].includes(a.status)
    ).length;

    return {
      ...job,
      applicants: jobApplicants.length,
      eligibleCandidates: eligibleCount,
      shortlistedCandidates: shortlistedCount,
    };
  });
}

// ---------------- COMPANY PROFILE ---------------- //

export function getCompanyProfile() {
  return readStorage(STORAGE_KEYS.PROFILE, DEFAULT_COMPANY_PROFILE);
}

export function updateCompanyProfile(updatedProfile) {
  const current = getCompanyProfile();
  const merged = { ...current, ...updatedProfile };
  writeStorage(STORAGE_KEYS.PROFILE, merged);

  addActivity("Company profile information was updated", "Settings");
  emitChange();
  return merged;
}

// ---------------- JOBS MANAGEMENT ---------------- //

export function getJobs() {
  const jobs = readStorage(STORAGE_KEYS.JOBS, INITIAL_COMPANY_JOBS);
  return attachJobCounts(jobs);
}

export function getJobById(id) {
  const jobs = getJobs();
  return jobs.find((j) => String(j.id) === String(id)) || null;
}

export function createJob(jobData) {
  const jobs = getJobs();
  const newId = jobs.length > 0 ? Math.max(...jobs.map((j) => Number(j.id) || 0)) + 1 : 1;

  const formattedDeadline = jobData.deadline
    ? new Date(jobData.deadline).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Ongoing";

  const profile = getCompanyProfile();
  const isUnverified = profile.status === "Pending Verification" || profile.isVerified === false;
  const companyName = jobData.company || profile.companyName || "Tata Consultancy Services (TCS)";

  const newJob = {
    ...jobData,
    id: newId,
    company: companyName,
    applicants: 0,
    eligibleCandidates: 0,
    shortlistedCandidates: 0,
    deadlineLabel: formattedDeadline,
    status: isUnverified || jobData.status === "Draft" ? "Draft" : "Pending Approval",
    createdAt: new Date().toISOString(),
  };

  const updatedJobs = [newJob, ...jobs];
  writeStorage(STORAGE_KEYS.JOBS, updatedJobs);

  // Sync with Admin Job Approvals if published
  if (newJob.status !== "Draft") {
    try {
      const rawApprovals = localStorage.getItem("git_careerai_admin_job_approvals");
      const approvals = rawApprovals ? JSON.parse(rawApprovals) : [];
      const newApproval = {
        id: `apv-${Date.now()}`,
        jobId: newId,
        company: companyName,
        title: newJob.title,
        department: newJob.department || "Software Engineering",
        location: newJob.location || "Mumbai",
        ctc: newJob.ctc || "₹7.0 - 9.0 LPA",
        workMode: newJob.workMode || "Hybrid",
        vacancies: Number(newJob.vacancies) || 5,
        minCgpa: Number(newJob.minCgpa) || 7.0,
        allowedBacklogs: Number(newJob.allowedBacklogs) || 0,
        allowedBranches: newJob.allowedBranches || ["Computer Engineering", "Information Technology"],
        deadline: formattedDeadline,
        submittedBy: "Priyanka Sharma (Campus Lead)",
        submittedDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "Pending",
        appliedStudents: 0,
      };
      localStorage.setItem(
        "git_careerai_admin_job_approvals",
        JSON.stringify([newApproval, ...approvals])
      );
    } catch {
      // Ignore
    }
  }

  addActivity(`New job posted: "${newJob.title}"`, "Briefcase");
  addNotification({
    title: `Job posted: ${newJob.title}`,
    description: `Opening created for ${newJob.department} (${newJob.location}).`,
    category: "job",
    link: `/company/jobs/${newId}`,
  });

  emitChange();
  return newJob;
}

export function updateJob(id, updates) {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => String(j.id) === String(id));
  if (idx === -1) return null;

  const profile = getCompanyProfile();
  const isUnverified = profile.status === "Pending Verification" || profile.isVerified === false;
  if (isUnverified && updates.status === "Active") {
    updates.status = "Pending Approval";
  }

  let deadlineLabel = jobs[idx].deadlineLabel;
  if (updates.deadline && updates.deadline !== jobs[idx].deadline) {
    deadlineLabel = new Date(updates.deadline).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const updatedJob = {
    ...jobs[idx],
    ...updates,
    deadlineLabel,
  };

  jobs[idx] = updatedJob;
  writeStorage(STORAGE_KEYS.JOBS, jobs);

  addActivity(`Updated job details for "${updatedJob.title}"`, "ClipboardList");
  emitChange();
  return updatedJob;
}

export function closeJob(id) {
  const job = updateJob(id, { status: "Closed" });
  if (job) {
    addActivity(`Job closed: "${job.title}"`, "FileText");
    addNotification({
      title: `${job.title} job has been closed`,
      description: "Applications for this position are no longer being accepted.",
      category: "job",
      link: `/company/jobs/${job.id}`,
    });
  }
  return job;
}

export function deleteJob(id) {
  const jobs = getJobs();
  const jobToDelete = jobs.find((j) => String(j.id) === String(id));
  const filtered = jobs.filter((j) => String(j.id) !== String(id));
  writeStorage(STORAGE_KEYS.JOBS, filtered);

  if (jobToDelete) {
    addActivity(`Deleted draft job: "${jobToDelete.title}"`, "FileText");
  }
  emitChange();
  return true;
}

// ---------------- APPLICANTS MANAGEMENT ---------------- //

export function getApplicants(filters = {}) {
  let applicants = readStorage(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);

  if (filters.jobId) {
    applicants = applicants.filter((a) => String(a.jobId) === String(filters.jobId));
  }
  if (filters.role && filters.role !== "All") {
    applicants = applicants.filter((a) => a.role === filters.role);
  }
  if (filters.status && filters.status !== "All") {
    applicants = applicants.filter((a) => a.status === filters.status);
  }
  if (filters.eligibility && filters.eligibility !== "All") {
    const isEligible = filters.eligibility === "Eligible";
    applicants = applicants.filter((a) => a.eligible === isEligible);
  }
  if (filters.search) {
    const query = filters.search.toLowerCase().trim();
    applicants = applicants.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.role.toLowerCase().includes(query) ||
        a.branch.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query)
    );
  }
  if (filters.sortBy) {
    if (filters.sortBy === "ats_desc") {
      applicants.sort((a, b) => b.atsScore - a.atsScore);
    } else if (filters.sortBy === "cgpa_desc") {
      applicants.sort((a, b) => b.cgpa - a.cgpa);
    } else if (filters.sortBy === "name_asc") {
      applicants.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  return applicants;
}

export function saveApplicants(newApplicantsList) {
  writeStorage(STORAGE_KEYS.APPLICANTS, newApplicantsList);
  syncJobCounts();
  emitChange();
}

export function getApplicantById(id) {
  const applicants = getApplicants();
  return applicants.find((a) => String(a.id) === String(id)) || null;
}

export function updateApplicantStatus(id, newStatus, extraData = {}) {
  const applicants = readStorage(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
  const idx = applicants.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return null;

  const candidate = applicants[idx];
  const oldStatus = candidate.status;

  // FIX #5: Prevent invalid status transitions
  if (oldStatus === "Rejected") {
    // Rejected is a terminal recruitment outcome
    return candidate;
  }
  if (oldStatus === "Selected" && (newStatus === "Applied" || newStatus === "Under Review")) {
    return candidate;
  }
  if (oldStatus === newStatus && !extraData.interviewDate) {
    // No-op status change, prevent redundant notification and activity
    return candidate;
  }

  let shortlistedDate = candidate.shortlistedDate;
  if (newStatus === "Shortlisted" && !shortlistedDate) {
    shortlistedDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const updatedCandidate = {
    ...candidate,
    status: newStatus,
    shortlistedDate,
    ...extraData,
  };

  applicants[idx] = updatedCandidate;
  writeStorage(STORAGE_KEYS.APPLICANTS, applicants);

  // Synchronize shortlisted counts on jobs
  syncJobCounts();

  // Log activity and notification
  if (newStatus === "Shortlisted") {
    addActivity(`${candidate.name} was shortlisted for ${candidate.role}`, "UserCheck");
    addNotification({
      title: `${candidate.name} shortlisted for ${candidate.role}`,
      description: `Candidate advanced to the interview pipeline with ATS score ${candidate.atsScore}%.`,
      category: "shortlist",
      link: `/company/shortlisted`,
    });
  } else if (newStatus === "Interview") {
    addActivity(`Interview scheduled for ${candidate.name} (${candidate.role})`, "Calendar");
    addNotification({
      title: `Interview scheduled: ${candidate.name}`,
      description: `Interview arranged for ${candidate.role}.`,
      category: "shortlist",
      link: `/company/shortlisted`,
    });
  } else if (newStatus === "Selected") {
    addActivity(`${candidate.name} was selected for ${candidate.role}!`, "Award");
    addNotification({
      title: `Candidate Selected: ${candidate.name}`,
      description: `Offer rollout recommended for ${candidate.role}.`,
      category: "shortlist",
      link: `/company/shortlisted`,
    });
  } else if (newStatus === "Rejected") {
    addActivity(`${candidate.name} application status set to Rejected`, "FileText");
    addNotification({
      title: `Candidate Rejected: ${candidate.name}`,
      description: `Application for ${candidate.role} marked as Rejected.`,
      category: "shortlist",
      link: `/company/applicants`,
    });
  } else {
    addActivity(`${candidate.name} moved from ${oldStatus} to ${newStatus}`, "Users");
  }

  // Cross-module sync: if candidate is Bilal Madre (demo@git.edu or student@git.edu)
  const isBilal =
    candidate.email === "demo@git.edu" ||
    candidate.email === "student@git.edu" ||
    candidate.name?.toLowerCase().includes("bilal");

  if (isBilal) {
    const interviewLabel = extraData.interviewDateLabel || "Tomorrow, 10:00 AM";
    const interviewMode = extraData.interviewMode || "Virtual Meeting";

    // 1. Sync student application status
    try {
      const rawApps = localStorage.getItem("git_careerai_student_applications");
      if (rawApps) {
        const apps = JSON.parse(rawApps);
        const updated = apps.map((a) => {
          const matchJob = candidate.jobId && String(a.jobId) === String(candidate.jobId);
          const matchApp = candidate.applicationId && String(a.id) === String(candidate.applicationId);
          const matchRoleFallback = !candidate.jobId && a.role === candidate.role;

          if (matchJob || matchApp || matchRoleFallback) {
            return {
              ...a,
              status: newStatus === "Interview" ? "Interview Scheduled" : newStatus,
              interviewDate: newStatus === "Interview" ? (extraData.interviewDate || new Date().toISOString()) : (newStatus === "Rejected" ? null : a.interviewDate),
              interviewDateLabel: newStatus === "Interview" ? interviewLabel : (newStatus === "Rejected" ? null : a.interviewDateLabel),
              interviewMode: newStatus === "Interview" ? interviewMode : (newStatus === "Rejected" ? null : a.interviewMode),
              interviewRound: newStatus === "Interview" ? "Technical Round 1" : (newStatus === "Rejected" ? null : a.interviewRound),
            };
          }
          return a;
        });
        localStorage.setItem("git_careerai_student_applications", JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }

    // 2. If Interview scheduled, create or update student interview (FIX #6: strictly match by jobId)
    if (newStatus === "Interview") {
      try {
        const rawInterviews = localStorage.getItem("git_careerai_student_interviews");
        const interviews = rawInterviews ? JSON.parse(rawInterviews) : [];

        let scheduledDate = new Date(Date.now() + 86400000).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        let scheduledTime = "10:00 AM";

        if (extraData.interviewDate) {
          const d = new Date(extraData.interviewDate);
          if (!isNaN(d.getTime())) {
            scheduledDate = d.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            scheduledTime = d.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          }
        }

        const existingIdx = interviews.findIndex((i) => {
          if (candidate.jobId && i.jobId) {
            return String(i.jobId) === String(candidate.jobId);
          }
          if (candidate.applicationId && i.applicationId) {
            return String(i.applicationId) === String(candidate.applicationId);
          }
          return candidate.role && i.role?.toLowerCase() === candidate.role?.toLowerCase();
        });

        if (existingIdx !== -1) {
          interviews[existingIdx] = {
            ...interviews[existingIdx],
            role: candidate.role || interviews[existingIdx].role,
            date: scheduledDate,
            time: scheduledTime,
            dateLabel: extraData.interviewDateLabel || `${scheduledDate}, ${scheduledTime}`,
            mode: interviewMode.includes("Virtual") ? "Online" : "On-campus",
            venue: interviewMode.includes("Virtual") ? "Virtual Meeting Room" : "Placement Block B",
            status: "Scheduled",
          };
        } else {
          const newInterview = {
            id: `int-${Date.now()}`,
            jobId: candidate.jobId,
            applicationId: candidate.applicationId || null,
            company: candidate.company || "Tata Consultancy Services (TCS)",
            role: candidate.role,
            round: "Technical Round 1",
            date: scheduledDate,
            time: scheduledTime,
            dateLabel: extraData.interviewDateLabel || `${scheduledDate}, ${scheduledTime}`,
            mode: interviewMode.includes("Virtual") ? "Online" : "On-campus",
            venue: interviewMode.includes("Virtual") ? "Virtual Meeting Room" : "Campus Placement Hall",
            meetingLink: "https://meet.google.com/campus-tcs-interview",
            status: "Scheduled",
            topics: ["Core Java", "DSA", "System Design"],
          };
          interviews.unshift(newInterview);
        }

        localStorage.setItem(
          "git_careerai_student_interviews",
          JSON.stringify(interviews)
        );
      } catch {
        // Ignore
      }
    }

    // FIX #2: If candidate is Rejected, cancel active interview
    if (newStatus === "Rejected") {
      try {
        const rawInterviews = localStorage.getItem("git_careerai_student_interviews");
        if (rawInterviews) {
          const interviews = JSON.parse(rawInterviews);
          const updated = interviews.map((i) => {
            const matchJob = candidate.jobId && String(i.jobId) === String(candidate.jobId);
            const matchApp = candidate.applicationId && String(i.applicationId) === String(candidate.applicationId);
            const matchRole = !candidate.jobId && i.role?.toLowerCase() === candidate.role?.toLowerCase();
            if (matchJob || matchApp || matchRole) {
              return { ...i, status: "Cancelled" };
            }
            return i;
          });
          localStorage.setItem("git_careerai_student_interviews", JSON.stringify(updated));
        }
      } catch {
        // Ignore
      }
    }

    // 3. Notify student (FIX #2: include Rejection notification)
    try {
      const rawNotifs = localStorage.getItem("git_careerai_student_notifications");
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      const newNotif = {
        id: `snotif-${Date.now()}`,
        title: newStatus === "Rejected"
          ? `Application Update: ${candidate.role}`
          : `Application Status Updated: ${candidate.role}`,
        message: newStatus === "Rejected"
          ? `Thank you for your interest in the ${candidate.role} position at ${candidate.company || "TCS"}. After careful consideration, your application was not selected for further rounds.`
          : `TCS has updated your application status to "${newStatus}".`,
        category: newStatus === "Interview" ? "interview" : "application",
        timestamp: "Just now",
        read: false,
        link: newStatus === "Interview" ? "/interviews" : "/applications",
      };
      localStorage.setItem(
        "git_careerai_student_notifications",
        JSON.stringify([newNotif, ...notifs])
      );
    } catch {
      // Ignore
    }

    // 4. Sync admin applications monitor
    try {
      const rawAdminApps = localStorage.getItem("git_careerai_admin_applications");
      if (rawAdminApps) {
        const adminApps = JSON.parse(rawAdminApps);
        const updated = adminApps.map((a) => {
          if (
            a.studentName?.toLowerCase().includes("bilal") ||
            a.rollNo === "22CE1045"
          ) {
            const matchJob = candidate.jobId && String(a.jobId) === String(candidate.jobId);
            const matchApp = candidate.applicationId && String(a.applicationId) === String(candidate.applicationId);
            const matchRole = a.role === candidate.role;
            if (matchJob || matchApp || matchRole) {
              return {
                ...a,
                status: newStatus === "Interview" ? "Interview Scheduled" : newStatus,
              };
            }
          }
          return a;
        });
        localStorage.setItem("git_careerai_admin_applications", JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }
  }

  emitChange();
  return updatedCandidate;
}

function syncJobCounts() {
  const jobs = getJobs();
  const applicants = readStorage(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);

  const updatedJobs = jobs.map((job) => {
    const jobApplicants = applicants.filter((a) => String(a.jobId) === String(job.id));
    const eligibleCount = jobApplicants.filter((a) => a.eligible).length;
    const shortlistedCount = jobApplicants.filter((a) =>
      ["Shortlisted", "Interview", "Selected"].includes(a.status)
    ).length;

    return {
      ...job,
      applicants: jobApplicants.length,
      eligibleCandidates: eligibleCount,
      shortlistedCandidates: shortlistedCount,
    };
  });

  writeStorage(STORAGE_KEYS.JOBS, updatedJobs);
}

// ---------------- NOTIFICATIONS ---------------- //

export function getNotifications() {
  return readStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function addNotification({ title, description, category = "application", link = "" }) {
  const notifications = getNotifications();
  if (notifications.length > 0 && notifications[0].title === title && notifications[0].time === "Just now") {
    return;
  }
  const newNotif = {
    id: Date.now(),
    title,
    description,
    category,
    time: "Just now",
    date: new Date().toISOString().split("T")[0],
    read: false,
    link,
  };
  writeStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifications]);
}

export function markNotificationRead(id) {
  const notifications = getNotifications();
  const updated = notifications.map((n) =>
    String(n.id) === String(id) ? { ...n, read: true } : n
  );
  writeStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  emitChange();
}

export function markAllNotificationsRead() {
  const notifications = getNotifications();
  const updated = notifications.map((n) => ({ ...n, read: true }));
  writeStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  emitChange();
}

// ---------------- RECENT ACTIVITIES ---------------- //

export function getActivities() {
  return readStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
}

export function addActivity(message, icon = "UserPlus") {
  const activities = getActivities();
  const newAct = {
    id: Date.now(),
    message,
    time: "Just now",
    icon,
  };
  writeStorage(STORAGE_KEYS.ACTIVITIES, [newAct, ...activities.slice(0, 9)]);
}

// ---------------- DASHBOARD KPI METRICS ---------------- //

export function getCompanyStats() {
  const jobs = getJobs();
  const applicants = getApplicants();

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const totalApplicants = applicants.length;
  const eligibleCandidates = applicants.filter((a) => a.eligible).length;
  const shortlisted = applicants.filter((a) =>
    ["Shortlisted", "Interview", "Selected"].includes(a.status)
  ).length;

  const atsScores = applicants.map((a) => a.atsScore || 0);
  const averageAtsMatch =
    atsScores.length > 0 ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length) : 0;
  const highestAtsMatch = atsScores.length > 0 ? Math.max(...atsScores) : 0;

  return {
    totalJobs,
    activeJobs,
    totalApplicants,
    eligibleCandidates,
    shortlisted,
    averageAtsMatch,
    highestAtsMatch,
  };
}
