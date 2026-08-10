const STORAGE_KEYS = {
  TOKEN: "git_careerai_token",
  USER: "git_careerai_user",
  USERS: "git_careerai_users",
};

const MOCK_LATENCY_MS = 600;

const SEED_USERS = [
  {
    id: "user-1",
    email: "demo@git.edu",
    password: "password123",
    fullName: "Bilal Shaikh",
    branch: "Computer Engineering",
    year: "4th Year",
  },
];

function delay(ms = MOCK_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (stored) return JSON.parse(stored);
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
  return {
    ...safeUser,
    name: safeUser.fullName?.trim().split(/\s+/)[0] || safeUser.fullName,
    branchLabel: `B.E. ${safeUser.branch}`,
  };
}

function persistSession(token, user) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getStoredSession() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userRaw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) };
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Mock login — replace the body of this function with a real API call:
 * const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
 */
export async function login(email, password) {
  await delay();

  const users = readUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );

  if (!match) {
    return { success: false, error: "Invalid email or password" };
  }

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

  const { fullName, email, password, branch, year } = payload;
  const users = readUsers();

  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return { success: false, error: "An account with this email already exists" };
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email: email.trim().toLowerCase(),
    password,
    fullName: fullName.trim(),
    branch,
    year,
  };

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
 * await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
 */
export async function forgotPassword(email) {
  await delay();

  const users = readUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!exists) {
    return { success: false, error: "No account found with this email address" };
  }

  return {
    success: true,
    data: { message: "Password reset link sent to your email" },
  };
}

export { clearSession };
