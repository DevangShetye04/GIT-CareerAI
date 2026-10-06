const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email.trim())) return "Enter a valid email address";
  return "";
}

export function validatePassword(password, minLength = 8) {
  if (!password) return "Password is required";
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
}

export function validateRequired(value, fieldName) {
  if (!value?.trim()) return `${fieldName} is required`;
  return "";
}

export function validateTerms(accepted) {
  if (!accepted) return "You must accept the terms and conditions";
  return "";
}

export function getFirstName(fullName) {
  return fullName?.trim().split(/\s+/)[0] || "";
}

export function getInitials(fullName) {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) || [];
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
