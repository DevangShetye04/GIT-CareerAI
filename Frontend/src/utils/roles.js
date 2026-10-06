export const ROLES = {
  STUDENT: "student",
  COMPANY: "company",
  ADMIN: "admin",
};

export function normalizeRole(role) {
  if (role === ROLES.COMPANY || role === ROLES.ADMIN) return role;
  return ROLES.STUDENT;
}

export function getDashboardPathForRole(role) {
  const normalized = normalizeRole(role);
  if (normalized === ROLES.COMPANY) return "/company/dashboard";
  if (normalized === ROLES.ADMIN) return "/admin/dashboard";
  return "/dashboard";
}
