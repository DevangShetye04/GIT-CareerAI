import { normalizeRole, ROLES } from "../utils/roles.js";

const STORAGE_KEYS = {
  TOKEN: "git_careerai_token",
  USER: "git_careerai_auth_user",
  LEGACY_USER: "git_careerai_user",
  USERS: "git_careerai_users",
};

const MOCK_LATENCY_MS = 600;

const SEED_USERS = [
  {
    id: "student-001",
    role: ROLES.STUDENT,
    email: "student@git.edu",
    password: "student123",
    name: "Bilal Madre",
    fullName: "Bilal Madre",
    branch: "Computer Engineering",
    year: "4th Year",
    designation: "Student",
    college: "Gharda Institute of Technology",
  },
  {
    id: "student-002",
    role: ROLES.STUDENT,
    email: "demo@git.edu",
    password: "password123",
    name: "Bilal Madre",
    fullName: "Bilal Madre",
    branch: "Computer Engineering",
    year: "4th Year",
    designation: "Student",
    college: "Gharda Institute of Technology",
  },
  {
    id: "company-001",
    role: ROLES.COMPANY,
    email: "recruiter@tcs.com",
    password: "company123",
    companyName: "Tata Consultancy Services (TCS)",
    fullName: "Tata Consultancy Services (TCS)",
    name: "Tata Consultancy Services (TCS)",
    industry: "Information Technology",
    location: "Mumbai, Maharashtra",
    website: "https://www.tcs.com",
    contactPerson: "Priyanka Sharma (Campus Lead)",
    designation: "Campus Recruitment Lead",
    phone: "+91 98201 23456",
    college: "Gharda Institute of Technology",
    status: "Verified",
    isVerified: true,
  },
  {
    id: "company-002",
    role: ROLES.COMPANY,
    email: "company@tcs.com",
    password: "password123",
    companyName: "Tata Consultancy Services (TCS)",
    fullName: "Tata Consultancy Services (TCS)",
    name: "Tata Consultancy Services (TCS)",
    industry: "Information Technology",
    location: "Mumbai, Maharashtra",
    website: "https://www.tcs.com",
    contactPerson: "HR Team",
    designation: "HR Team",
    phone: "+91 9876543210",
    college: "Gharda Institute of Technology",
    status: "Verified",
    isVerified: true,
  },
  {
    id: "admin-001",
    role: ROLES.ADMIN,
    email: "admin@git.edu",
    password: "admin123",
    name: "Dr. Arvind Rao",
    fullName: "Dr. Arvind Rao",
    designation: "Head, Training & Placement Cell",
    college: "Gharda Institute of Technology",
    placementCell: "Training & Placement Cell",
  },
];

function delay(ms = MOCK_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function migrateUserRecord(user) {
  if (!user.role) {
    return { ...user, role: ROLES.STUDENT };
  }
  return user;
}

const AUTH_VERSION = "2.1";
const AUTH_VERSION_KEY = "git_careerai_auth_version";

function checkAuthVersion() {
  try {
    const current = localStorage.getItem(AUTH_VERSION_KEY);
    if (current !== AUTH_VERSION) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(AUTH_VERSION_KEY, AUTH_VERSION);
    }
  } catch {
    // Ignore in restricted mode
  }
}
checkAuthVersion();

function readUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (stored) {
      const parsed = JSON.parse(stored).map(migrateUserRecord);
      const emailMap = new Map(parsed.map((u) => [u.email.toLowerCase(), u]));
      let changed = false;

      for (const seed of SEED_USERS) {
        const existing = emailMap.get(seed.email.toLowerCase());
        if (!existing) {
          parsed.push(seed);
          changed = true;
        } else {
          if (existing.password !== seed.password) {
            existing.password = seed.password;
            changed = true;
          }
          if (seed.role === ROLES.STUDENT && (existing.name?.includes("Shaikh") || existing.fullName?.includes("Shaikh"))) {
            existing.name = seed.name;
            existing.fullName = seed.fullName;
            changed = true;
          }
        }
      }

      if (changed) {
        writeUsers(parsed);
      }
      return parsed.map(migrateUserRecord);
    }
  } catch {
    /* fall through to seed */
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  return SEED_USERS;
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function createToken(userId) {
  return `mock-jwt.${btoa(JSON.stringify({ sub: userId, iat: Date.now() }))}.sig`;
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  const role = normalizeRole(safeUser.role);

  if (role === ROLES.COMPANY) {
    const companyName = safeUser.companyName || safeUser.fullName || safeUser.name || "Company";
    return {
      ...safeUser,
      id: safeUser.id,
      role,
      name: companyName,
      fullName: companyName,
      companyName,
      email: safeUser.email,
      designation: safeUser.designation || "Campus Recruitment Lead",
      college: safeUser.college || "Gharda Institute of Technology",
      status: safeUser.status || "Verified",
      isVerified: safeUser.status === "Verified",
    };
  }

  if (role === ROLES.ADMIN) {
    const adminName = safeUser.fullName || safeUser.name || "Placement Cell Admin";
    return {
      ...safeUser,
      id: safeUser.id,
      role,
      name: adminName,
      fullName: adminName,
      email: safeUser.email,
      designation: safeUser.designation || "Placement Cell Admin",
      college: safeUser.college || "Gharda Institute of Technology",
      placementCell: safeUser.placementCell || "Training & Placement Cell",
    };
  }

  const studentName = safeUser.fullName || safeUser.name || "Student";
  return {
    ...safeUser,
    id: safeUser.id,
    role,
    name: studentName,
    fullName: studentName,
    email: safeUser.email,
    designation: safeUser.designation || "Student",
    college: safeUser.college || "Gharda Institute of Technology",
    branch: safeUser.branch || "Computer Engineering",
    branchLabel: safeUser.branch ? `B.E. ${safeUser.branch}` : undefined,
  };
}

function persistSession(token, user) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.LEGACY_USER, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LEGACY_USER);
}

export function getStoredSession() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userRaw =
    localStorage.getItem(STORAGE_KEYS.USER) || localStorage.getItem(STORAGE_KEYS.LEGACY_USER);
  if (!token || !userRaw) return null;
  try {
    const user = JSON.parse(userRaw);
    if (user.role === ROLES.STUDENT && (user.name?.includes("Shaikh") || user.fullName?.includes("Shaikh"))) {
      user.name = "Bilal Madre";
      user.fullName = "Bilal Madre";
      persistSession(token, user);
    }
    return { token, user: { ...user, role: normalizeRole(user.role) } };
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Mock login — replace the body of this function with a real API call:
 * const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) });
 */
export async function login(email, password) {
  await delay();

  const users = readUsers();
  const emailNorm = email.trim().toLowerCase();
  const match = users.find(
    (u) => u.email.toLowerCase() === emailNorm && u.password === password
  );

  if (!match) {
    return { success: false, error: "Invalid email or password" };
  }

  // The stored user's actual technical role ALWAYS wins!
  const user = sanitizeUser(match);
  const token = createToken(match.id);
  persistSession(token, user);

  return { success: true, data: { token, user } };
}

/**
 * Mock register — replace with:
 * const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
 */
export async function register(payload) {
  await delay();

  // Admin accounts must NEVER be registered publicly
  if (payload.role === ROLES.ADMIN) {
    return {
      success: false,
      error: "Placement Admin accounts cannot be registered publicly. They must be provisioned institutionally.",
    };
  }

  const role = normalizeRole(payload.role || ROLES.STUDENT);
  const email = payload.email?.trim().toLowerCase();
  const users = readUsers();

  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { success: false, error: "An account with this email already exists" };
  }

  let newUser;

  if (role === ROLES.COMPANY) {
    newUser = {
      id: `company-${Date.now()}`,
      role: ROLES.COMPANY,
      email,
      password: payload.password,
      companyName: payload.companyName?.trim(),
      fullName: payload.companyName?.trim(),
      name: payload.companyName?.trim(),
      industry: payload.industry,
      location: payload.location?.trim(),
      website: payload.website?.trim(),
      contactPerson: payload.contactPerson?.trim(),
      designation: "Campus Recruitment Lead",
      phone: payload.phone?.trim(),
      college: "Gharda Institute of Technology",
      status: "Pending Verification",
      isVerified: false,
    };

    // Synchronize to Admin's Partner Companies directory
    try {
      const rawAdminComps = localStorage.getItem("git_careerai_admin_companies");
      const adminComps = rawAdminComps ? JSON.parse(rawAdminComps) : [];
      const newAdminComp = {
        id: `comp-${Date.now()}`,
        name: newUser.companyName,
        industry: newUser.industry || "Information Technology",
        location: newUser.location || "Maharashtra",
        website: newUser.website || "https://example.com",
        spoc: newUser.contactPerson || "Campus Lead",
        spocEmail: newUser.email,
        spocPhone: newUser.phone || "+91 98000 00000",
        email: newUser.email,
        phone: newUser.phone,
        status: "Pending Verification",
        openingsCount: 0,
        offersReleased: 0,
        tier: "Pending Verification",
      };
      if (!adminComps.some((c) => c.email === newUser.email)) {
        adminComps.unshift(newAdminComp);
        localStorage.setItem("git_careerai_admin_companies", JSON.stringify(adminComps));
      }
    } catch {
      // Ignore
    }
  } else {
    newUser = {
      id: `student-${Date.now()}`,
      role: ROLES.STUDENT,
      email,
      password: payload.password,
      fullName: payload.fullName?.trim(),
      name: payload.fullName?.trim(),
      branch: payload.branch,
      year: payload.year,
      college: "Gharda Institute of Technology",
      designation: "Student",
    };

    // Synchronize to Admin's Student Directory
    try {
      const rawAdminStudents = localStorage.getItem("git_careerai_admin_students");
      const adminStudents = rawAdminStudents ? JSON.parse(rawAdminStudents) : [];
      const branchCode = (newUser.branch || "CE").substring(0, 2).toUpperCase();
      const newAdminStudent = {
        id: `std-${Date.now()}`,
        rollNo: `22${branchCode}${Math.floor(1000 + Math.random() * 9000)}`,
        name: newUser.fullName,
        email: newUser.email,
        branch: newUser.branch || "Computer Engineering",
        batch: "2026",
        cgpa: 8.0,
        backlogs: 0,
        placementStatus: "Unplaced",
        verified: false,
        appliedCount: 0,
        offersCount: 0,
        phone: "+91 98000 00000",
      };
      if (!adminStudents.some((s) => s.email === newUser.email)) {
        adminStudents.unshift(newAdminStudent);
        localStorage.setItem("git_careerai_admin_students", JSON.stringify(adminStudents));
      }
    } catch {
      // Ignore
    }
  }

  writeUsers([...users, newUser]);

  const user = sanitizeUser(newUser);
  const token = createToken(newUser.id);
  persistSession(token, user);

  return { success: true, data: { token, user } };
}

/**
 * Mock logout — replace with:
 * await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
 */
export async function logout() {
  await delay(200);
  clearSession();
  return { success: true };
}

/**
 * Mock forgot password — replace with:
 * await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email, role }) });
 */
export async function forgotPassword(email, expectedRole = ROLES.STUDENT) {
  await delay();

  const users = readUsers();
  const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!match) {
    return { success: false, error: "No account found with this email address" };
  }

  const userRole = normalizeRole(match.role);
  const role = normalizeRole(expectedRole);

  if (userRole !== role) {
    return { success: false, error: "No account found with this email address for the selected account type" };
  }

  return {
    success: true,
    data: { message: "Password reset link sent to your email" },
  };
}

export { clearSession };
