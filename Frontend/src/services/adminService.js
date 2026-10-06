import {
  INITIAL_ADMIN_STUDENTS,
  INITIAL_ADMIN_COMPANIES,
  INITIAL_JOB_APPROVALS,
  INITIAL_PLACEMENT_DRIVES,
  INITIAL_COLLEGE_APPLICATIONS,
  INITIAL_PLACEMENTS,
  INITIAL_ADMIN_NOTIFICATIONS,
} from "../data/adminMockData.js";

const STORAGE_KEYS = {
  STUDENTS: "git_careerai_admin_students",
  COMPANIES: "git_careerai_admin_companies",
  JOB_APPROVALS: "git_careerai_admin_job_approvals",
  DRIVES: "git_careerai_admin_drives",
  APPLICATIONS: "git_careerai_admin_applications",
  PLACEMENTS: "git_careerai_admin_placements",
  NOTIFICATIONS: "git_careerai_admin_notifications",
  VERSION: "git_careerai_admin_version",
};

const DATA_VERSION = "2.2";

function checkStorageVersion() {
  try {
    const current = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (current !== DATA_VERSION) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_ADMIN_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_ADMIN_COMPANIES));
      localStorage.setItem(STORAGE_KEYS.JOB_APPROVALS, JSON.stringify(INITIAL_JOB_APPROVALS));
      localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(INITIAL_PLACEMENT_DRIVES));
      localStorage.setItem(
        STORAGE_KEYS.APPLICATIONS,
        JSON.stringify(INITIAL_COLLEGE_APPLICATIONS)
      );
      localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(INITIAL_PLACEMENTS));
      localStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(INITIAL_ADMIN_NOTIFICATIONS)
      );
      localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
    } else {
      // Ensure cached records reflect Bilal Madre
      const rawStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (rawStudents && rawStudents.includes("Shaikh")) {
        const stds = JSON.parse(rawStudents).map((s) =>
          s.rollNo === "22CE1045" || s.name?.includes("Shaikh")
            ? { ...s, name: "Bilal Madre" }
            : s
        );
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(stds));
      }
      const rawApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (rawApps && rawApps.includes("Shaikh")) {
        const apps = JSON.parse(rawApps).map((a) =>
          a.rollNo === "22CE1045" || a.studentName?.includes("Shaikh")
            ? { ...a, studentName: "Bilal Madre" }
            : a
        );
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      }
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}
checkStorageVersion();

const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("AdminService listener error", e);
    }
  });
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---------------------------------------------------------------------------
// Dashboard KPI Metrics
// ---------------------------------------------------------------------------
export function getAdminStats() {
  const students = getAdminStudents();
  const companies = getAdminCompanies();
  const approvals = getJobApprovals();
  const drives = getPlacementDrives();
  const placements = getPlacements();
  const applications = getCollegeApplications();

  let activeJobsCount = 0;
  try {
    const rawJobs = localStorage.getItem("git_careerai_company_jobs");
    if (rawJobs) {
      const jobs = JSON.parse(rawJobs);
      activeJobsCount = jobs.filter((j) => j.status === "Active").length;
    }
  } catch {
    activeJobsCount = approvals.filter((a) => a.status === "Approved").length;
  }

  const totalStudents = students.length;
  const registeredCompanies = companies.length;
  const activeJobs = activeJobsCount || approvals.filter((a) => a.status === "Approved").length;
  const totalApplications = applications.length;
  const placedCount = students.filter((s) => s.placementStatus === "Placed").length;
  const placementRate = totalStudents > 0
    ? `${((placedCount / totalStudents) * 100).toFixed(1)}%`
    : "0.0%";
  const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;
  const upcomingDrives = drives.filter((d) => d.status !== "Completed").length;

  return {
    totalStudents,
    registeredCompanies,
    activeJobs,
    totalApplications,
    placedCount,
    placementRate,
    pendingApprovals,
    upcomingDrives,
  };
}

// ---------------------------------------------------------------------------
// Students Management
// ---------------------------------------------------------------------------
export function getAdminStudents(filters = {}) {
  let students = INITIAL_ADMIN_STUDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw) students = JSON.parse(raw);
  } catch {
    // Fall back
  }

  if (filters.branch && filters.branch !== "All") {
    students = students.filter((s) => s.branch === filters.branch);
  }
  if (filters.status && filters.status !== "All") {
    students = students.filter((s) => s.placementStatus === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    students = students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }

  return students;
}

export function toggleStudentVerified(id) {
  const students = getAdminStudents();
  const updated = students.map((s) => (s.id === id ? { ...s, verified: !s.verified } : s));
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
}

// ---------------------------------------------------------------------------
// Companies Management
// ---------------------------------------------------------------------------
export function getAdminCompanies(filters = {}) {
  let companies = INITIAL_ADMIN_COMPANIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (raw) companies = JSON.parse(raw);
  } catch {
    // Fall back
  }

  if (filters.industry && filters.industry !== "All") {
    companies = companies.filter((c) => c.industry === filters.industry);
  }
  if (filters.status && filters.status !== "All") {
    companies = companies.filter((c) => c.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    companies = companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.spoc.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }

  return companies;
}

export function toggleCompanyStatus(id, newStatus) {
  const companies = getAdminCompanies();
  let targetCompany = null;
  const updated = companies.map((c) => {
    if (c.id === id) {
      targetCompany = c;
      return { ...c, status: newStatus };
    }
    return c;
  });

  try {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  // Cross-module sync: if this company has an account, sync status
  if (targetCompany) {
    try {
      const isVerified = newStatus === "Verified" || newStatus === "Active";
      const rawUsers = localStorage.getItem("git_careerai_users");
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const updatedUsers = users.map((u) => {
          if (
            u.email?.toLowerCase() === targetCompany.email?.toLowerCase() ||
            u.email?.toLowerCase() === targetCompany.spocEmail?.toLowerCase() ||
            u.companyName?.toLowerCase() === targetCompany.name?.toLowerCase()
          ) {
            return { ...u, status: newStatus, isVerified };
          }
          return u;
        });
        localStorage.setItem("git_careerai_users", JSON.stringify(updatedUsers));
      }

      for (const key of ["git_careerai_auth_user", "git_careerai_user"]) {
        const rawAuth = localStorage.getItem(key);
        if (rawAuth) {
          const authUser = JSON.parse(rawAuth);
          if (
            authUser.email?.toLowerCase() === targetCompany.email?.toLowerCase() ||
            authUser.email?.toLowerCase() === targetCompany.spocEmail?.toLowerCase() ||
            authUser.name?.toLowerCase() === targetCompany.name?.toLowerCase()
          ) {
            authUser.status = newStatus;
            authUser.isVerified = isVerified;
            localStorage.setItem(key, JSON.stringify(authUser));
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  emitChange();
}

// ---------------------------------------------------------------------------
// Job Approvals
// ---------------------------------------------------------------------------
export function getJobApprovals(status) {
  let approvals = INITIAL_JOB_APPROVALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOB_APPROVALS);
    if (raw) approvals = JSON.parse(raw);
  } catch {
    // Fall back
  }

  if (status && status !== "All") {
    return approvals.filter((a) => a.status === status);
  }
  return approvals;
}

export function addJobApproval(jobData) {
  const approvals = getJobApprovals();
  const newApproval = {
    id: `apv-${Date.now()}`,
    status: "Pending",
    appliedStudents: 0,
    ...jobData,
  };
  const updated = [newApproval, ...approvals];
  try {
    localStorage.setItem(STORAGE_KEYS.JOB_APPROVALS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
  return newApproval;
}

export function approveJob(id) {
  const approvals = getJobApprovals();
  const target = approvals.find((a) => a.id === id);
  if (!target) {
    return { success: false, error: "Job approval request not found." };
  }

  // FIX #4: Unverified company check
  const companies = getAdminCompanies();
  const comp = companies.find(
    (c) => c.name?.toLowerCase() === target.company?.toLowerCase()
  );
  if (comp && (comp.status === "Pending Verification" || comp.status === "Rejected")) {
    return {
      success: false,
      error: `Cannot approve job: ${target.company} is currently "${comp.status}". Recruiters must be verified before job listings are activated.`,
    };
  }

  let approvedTitle = target.title;
  let targetJobId = target.jobId;
  const updated = approvals.map((a) => {
    if (a.id === id) {
      return { ...a, status: "Approved" };
    }
    return a;
  });
  try {
    localStorage.setItem(STORAGE_KEYS.JOB_APPROVALS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  // Ensure corresponding company job is Active
  try {
    const rawJobs = localStorage.getItem("git_careerai_company_jobs");
    if (rawJobs) {
      const jobs = JSON.parse(rawJobs);
      const updatedCompanyJobs = jobs.map((j) => {
        const matchById = targetJobId && (Number(j.id) === Number(targetJobId) || String(j.id) === String(targetJobId));
        const matchByTitle = j.title === approvedTitle;
        if (matchById || matchByTitle) {
          return { ...j, status: "Active" };
        }
        return j;
      });
      localStorage.setItem("git_careerai_company_jobs", JSON.stringify(updatedCompanyJobs));
    }
  } catch {
    // Ignore
  }

  addAdminNotification({
    title: "Job Approved for Placement Drives",
    message: `Job opening "${approvedTitle || id}" approved and made visible to campus students.`,
    category: "approval",
    link: "/admin/job-approvals",
  });

  emitChange();
  return { success: true };
}

export function rejectJob(id, reason = "Criteria does not meet college standards") {
  const approvals = getJobApprovals();
  let rejectedTitle = "";
  let targetJobId = null;
  const updated = approvals.map((a) => {
    if (a.id === id) {
      rejectedTitle = a.title;
      targetJobId = a.jobId;
      return { ...a, status: "Rejected", rejectionReason: reason };
    }
    return a;
  });
  try {
    localStorage.setItem(STORAGE_KEYS.JOB_APPROVALS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  // Ensure corresponding company job is Rejected
  try {
    const rawJobs = localStorage.getItem("git_careerai_company_jobs");
    if (rawJobs) {
      const jobs = JSON.parse(rawJobs);
      const updatedCompanyJobs = jobs.map((j) => {
        const matchById = targetJobId && (Number(j.id) === Number(targetJobId) || String(j.id) === String(targetJobId));
        const matchByTitle = j.title === rejectedTitle;
        if (matchById || matchByTitle) {
          return { ...j, status: "Rejected", rejectionReason: reason };
        }
        return j;
      });
      localStorage.setItem("git_careerai_company_jobs", JSON.stringify(updatedCompanyJobs));
    }
  } catch {
    // Ignore
  }

  // FIX #3: Notify company of rejection
  try {
    const rawCNotifs = localStorage.getItem("git_careerai_company_notifications");
    const cNotifs = rawCNotifs ? JSON.parse(rawCNotifs) : [];
    const newNotif = {
      id: `cnotif-${Date.now()}`,
      title: `Job Listing Rejected: ${rejectedTitle || "Opening"}`,
      description: `Placement Cell reviewed and rejected this opening. Reason: ${reason}`,
      category: "job",
      timestamp: "Just now",
      read: false,
      link: "/company/jobs",
    };
    localStorage.setItem("git_careerai_company_notifications", JSON.stringify([newNotif, ...cNotifs]));
  } catch {
    // Ignore
  }

  addAdminNotification({
    title: "Job Listing Rejected",
    message: `Job opening "${rejectedTitle || id}" was rejected: ${reason}`,
    category: "approval",
    link: "/admin/job-approvals",
  });

  emitChange();
  return { success: true };
}

// ---------------------------------------------------------------------------
// Placement Drives
// ---------------------------------------------------------------------------
export function getPlacementDrives() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVES);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return INITIAL_PLACEMENT_DRIVES;
}

export function createPlacementDrive(driveData) {
  const drives = getPlacementDrives();
  const newDrive = {
    id: `drv-${Date.now()}`,
    status: "Scheduled",
    applicantsCount: 0,
    ...driveData,
  };
  const updated = [newDrive, ...drives];
  try {
    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  addAdminNotification({
    title: `Drive Scheduled: ${newDrive.driveName}`,
    message: `Campus drive for ${newDrive.company} on ${newDrive.dateLabel || newDrive.date} scheduled successfully.`,
    category: "drive",
    link: "/admin/drives",
  });

  emitChange();
  return newDrive;
}

export function closePlacementDrive(id) {
  const drives = getPlacementDrives();
  const updated = drives.map((d) => (d.id === id ? { ...d, status: "Completed" } : d));
  try {
    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
}

// ---------------------------------------------------------------------------
// College Applications Monitor
// ---------------------------------------------------------------------------
export function getCollegeApplications(filters = {}) {
  let applications = INITIAL_COLLEGE_APPLICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (raw) applications = JSON.parse(raw);
  } catch {
    // Fall back
  }

  if (filters.branch && filters.branch !== "All") {
    applications = applications.filter((a) => a.branch === filters.branch);
  }
  if (filters.status && filters.status !== "All") {
    applications = applications.filter((a) => a.status === filters.status);
  }
  if (filters.company && filters.company !== "All") {
    applications = applications.filter((a) => a.company === filters.company);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    applications = applications.filter(
      (a) =>
        a.studentName.toLowerCase().includes(q) ||
        a.rollNo.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q)
    );
  }

  return applications;
}

export function recordCollegeApplication(data) {
  const applications = getCollegeApplications();
  const newApp = {
    id: `capp-${Date.now()}`,
    status: "Applied",
    appliedDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    ...data,
  };
  const updated = [newApp, ...applications];
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
  return newApp;
}

export function updateCollegeApplicationStatus(studentNameOrRollNo, role, newStatus) {
  const applications = getCollegeApplications();
  const updated = applications.map((a) => {
    const matchesStudent =
      a.studentName.toLowerCase().includes(studentNameOrRollNo.toLowerCase()) ||
      a.rollNo === studentNameOrRollNo;
    if (matchesStudent && (!role || a.role === role)) {
      return { ...a, status: newStatus };
    }
    return a;
  });
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
}

// ---------------------------------------------------------------------------
// Placements Record
// ---------------------------------------------------------------------------
export function getPlacements() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLACEMENTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return INITIAL_PLACEMENTS;
}

export function recordPlacement(data) {
  const placements = getPlacements();

  // FIX #1: Prevent Duplicate Placements
  const isDuplicate = placements.some((p) => {
    const matchRoll =
      data.rollNo && p.rollNo && p.rollNo.trim().toLowerCase() === data.rollNo.trim().toLowerCase();
    const matchName =
      data.studentName &&
      p.studentName &&
      p.studentName.trim().toLowerCase() === data.studentName.trim().toLowerCase();
    const matchCompany =
      data.company && p.company && p.company.trim().toLowerCase() === data.company.trim().toLowerCase();
    const matchRole =
      data.role && p.role && p.role.trim().toLowerCase() === data.role.trim().toLowerCase();

    return (matchRoll || matchName) && matchCompany && matchRole;
  });

  if (isDuplicate) {
    return {
      success: false,
      error: `Duplicate placement: ${data.studentName || data.rollNo} already has an official placement recorded for ${data.company} - ${data.role}.`,
    };
  }

  const newPlacement = {
    id: `plc-${Date.now()}`,
    status: "Offer Accepted",
    ...data,
  };
  const updated = [newPlacement, ...placements];
  try {
    localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  // Cross-module sync: if placed student is Bilal Madre (rollNo 22CE1045 or name Bilal)
  const isBilal =
    data.rollNo === "22CE1045" ||
    data.studentName?.toLowerCase().includes("bilal");

  if (isBilal) {
    try {
      const rawProfile = localStorage.getItem("git_careerai_student_profile");
      if (rawProfile) {
        const prof = JSON.parse(rawProfile);
        localStorage.setItem(
          "git_careerai_student_profile",
          JSON.stringify({ ...prof, placementStatus: "Placed", offersCount: (prof.offersCount || 0) + 1 })
        );
      }
    } catch {
      // Ignore
    }

    try {
      const rawStudentApps = localStorage.getItem("git_careerai_student_applications");
      if (rawStudentApps) {
        const studentApps = JSON.parse(rawStudentApps);
        const updatedStudentApps = studentApps.map((a) =>
          a.company === data.company || a.role === data.role
            ? { ...a, status: "Offer Accepted" }
            : a
        );
        localStorage.setItem(
          "git_careerai_student_applications",
          JSON.stringify(updatedStudentApps)
        );
      }
    } catch {
      // Ignore
    }

    try {
      const rawNotifs = localStorage.getItem("git_careerai_student_notifications");
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      const placedNotif = {
        id: `snotif-${Date.now()}`,
        title: `Congratulations! Placement Verified at ${data.company}`,
        message: `Your campus placement offer for ${data.role} with package ${data.ctc} has been officially approved and recorded by the Placement Cell.`,
        category: "placement",
        timestamp: "Just now",
        read: false,
        link: "/applications",
      };
      localStorage.setItem(
        "git_careerai_student_notifications",
        JSON.stringify([placedNotif, ...notifs])
      );
    } catch {
      // Ignore
    }
  }

  // Cross-module sync: Update Admin Student Directory
  try {
    const rawStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (rawStudents) {
      const students = JSON.parse(rawStudents);
      const updatedStudents = students.map((s) => {
        const matchByRoll = data.rollNo && s.rollNo === data.rollNo;
        const matchByName = data.studentName && s.name.toLowerCase() === data.studentName.toLowerCase();
        if (matchByRoll || matchByName) {
          return {
            ...s,
            placementStatus: "Placed",
            offersCount: (s.offersCount || 0) + 1,
          };
        }
        return s;
      });
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    }
  } catch {
    // Ignore
  }

  // Cross-module sync: Update Admin College Applications Monitor
  try {
    const rawAdminApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (rawAdminApps) {
      const adminApps = JSON.parse(rawAdminApps);
      const updatedAdminApps = adminApps.map((a) => {
        const matchStudent =
          (data.rollNo && a.rollNo === data.rollNo) ||
          (data.studentName && a.studentName?.toLowerCase() === data.studentName.toLowerCase());
        const matchRole = !data.role || a.role === data.role;
        if (matchStudent && matchRole) {
          return { ...a, status: "Offer Accepted" };
        }
        return a;
      });
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updatedAdminApps));
    }
  } catch {
    // Ignore
  }

  // Cross-module sync: Update Company Applicants
  try {
    const rawApplicants = localStorage.getItem("git_careerai_company_applicants");
    if (rawApplicants) {
      const applicants = JSON.parse(rawApplicants);
      const updatedApplicants = applicants.map((cand) => {
        const matchName =
          data.studentName &&
          cand.name.toLowerCase().includes(data.studentName.toLowerCase().split(" ")[0]);
        const matchRole = !data.role || cand.role === data.role;
        if (matchName && matchRole) {
          return { ...cand, status: "Selected" };
        }
        return cand;
      });
      localStorage.setItem("git_careerai_company_applicants", JSON.stringify(updatedApplicants));
    }
  } catch {
    // Ignore
  }

  addAdminNotification({
    title: `New Placement Recorded: ${data.studentName}`,
    message: `${data.studentName} (${data.branch}) placed at ${data.company} with package ${data.ctc}.`,
    category: "placement",
    link: "/admin/placements",
  });

  emitChange();
  return { success: true, placement: newPlacement, ...newPlacement };
}

// ---------------------------------------------------------------------------
// Reports Data
// ---------------------------------------------------------------------------
export function getReportsData() {
  return {
    kpis: {
      placementRate: "76.8%",
      placedCount: 323,
      totalRegistered: 420,
      highestPackage: "₹14.5 LPA",
      highestPackageCompany: "Nimbus Cloud",
      averagePackage: "₹7.2 LPA",
      medianPackage: "₹6.8 LPA",
      totalCompaniesVisited: 18,
    },
    branchBreakdown: [
      { branch: "Computer Engineering", placed: 106, total: 120, rate: 88.3 },
      { branch: "Information Technology", placed: 76, total: 90, rate: 84.4 },
      { branch: "Electronics & Telecommunication", placed: 58, total: 80, rate: 72.5 },
      { branch: "Electrical Engineering", placed: 32, total: 50, rate: 64.0 },
      { branch: "Mechanical Engineering", placed: 29, total: 50, rate: 58.0 },
      { branch: "Civil Engineering", placed: 16, total: 30, rate: 53.3 },
    ],
    salaryTiers: [
      { tier: "₹10 LPA & Above", count: 28, percentage: 8.7, color: "bg-teal" },
      { tier: "₹7.5 - 10 LPA", count: 96, percentage: 29.7, color: "bg-teal-soft text-teal-dark" },
      { tier: "₹5.0 - 7.5 LPA", count: 145, percentage: 44.9, color: "bg-amber" },
      { tier: "< ₹5.0 LPA", count: 54, percentage: 16.7, color: "bg-coral" },
    ],
    topRecruiters: [
      { company: "Tata Consultancy Services", hires: 42, avgPackage: "₹7.8 LPA" },
      { company: "Infosys Limited", hires: 34, avgPackage: "₹7.0 LPA" },
      { company: "Persistent Systems", hires: 22, avgPackage: "₹8.2 LPA" },
      { company: "Zenith Automotive", hires: 16, avgPackage: "₹6.5 LPA" },
      { company: "Nimbus Cloud", hires: 12, avgPackage: "₹9.2 LPA" },
    ],
  };
}

// ---------------------------------------------------------------------------
// Admin Notifications
// ---------------------------------------------------------------------------
export function getAdminNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return INITIAL_ADMIN_NOTIFICATIONS;
}

export function addAdminNotification(notif) {
  const current = getAdminNotifications();
  if (current.length > 0 && current[0].title === notif.title && current[0].timestamp === "Just now") {
    return current[0];
  }
  const newNotif = {
    id: `anotif-${Date.now()}`,
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

export function markAdminNotificationRead(id) {
  const current = getAdminNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
}

export function markAllAdminNotificationsRead() {
  const current = getAdminNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
}

// ---------------------------------------------------------------------------
// College / Institution Configuration (Reusability & White-label readiness)
// ---------------------------------------------------------------------------
export const DEFAULT_COLLEGE_CONFIG = {
  collegeName: "Gharda Institute of Technology",
  collegeShortName: "GIT",
  placementCellName: "Training & Placement Cell",
  location: "Lavel, Khed, Maharashtra",
  accreditation: "NAAC 'A' Grade Accredited",
};

export function getCollegeConfig() {
  try {
    const raw = localStorage.getItem("git_careerai_college_config");
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back
  }
  return DEFAULT_COLLEGE_CONFIG;
}

export function updateCollegeConfig(updates) {
  const current = getCollegeConfig();
  const updated = { ...current, ...updates };
  try {
    localStorage.setItem("git_careerai_college_config", JSON.stringify(updated));
  } catch {
    // Ignore
  }
  emitChange();
  return updated;
}

