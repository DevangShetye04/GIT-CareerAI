import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import { RegisterRoleSelector } from "../../components/ui/RoleSelector.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { BRANCHES, YEARS } from "../../data/mockData.js";
import { COMPANY_INDUSTRIES } from "../../data/companyMockData.js";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validateTerms,
} from "../../utils/validators.js";
import { getDashboardPathForRole, ROLES } from "../../utils/roles.js";

const emptyStudent = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  branch: "",
  year: "",
  terms: false,
};

const emptyCompany = {
  companyName: "",
  email: "",
  password: "",
  confirmPassword: "",
  industry: "",
  location: "",
  website: "",
  contactPerson: "",
  phone: "",
  terms: false,
};

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [accountRole, setAccountRole] = useState(ROLES.STUDENT);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [fieldErrors, setFieldErrors] = useState({});

  function updateStudent(key, value) {
    setStudentForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function updateCompany(key, value) {
    setCompanyForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validateStudentForm() {
    const errors = {
      fullName: validateRequired(studentForm.fullName, "Full name"),
      email: validateEmail(studentForm.email),
      password: validatePassword(studentForm.password),
      confirmPassword: validateConfirmPassword(
        studentForm.password,
        studentForm.confirmPassword
      ),
      branch: validateRequired(studentForm.branch, "Branch / department"),
      year: validateRequired(studentForm.year, "Year"),
      terms: validateTerms(studentForm.terms),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  }

  function validateCompanyForm() {
    const errors = {
      companyName: validateRequired(companyForm.companyName, "Company name"),
      email: validateEmail(companyForm.email),
      password: validatePassword(companyForm.password),
      confirmPassword: validateConfirmPassword(
        companyForm.password,
        companyForm.confirmPassword
      ),
      industry: validateRequired(companyForm.industry, "Industry"),
      location: validateRequired(companyForm.location, "Company location"),
      website: validateRequired(companyForm.website, "Website"),
      contactPerson: validateRequired(companyForm.contactPerson, "Contact person"),
      phone: validateRequired(companyForm.phone, "Phone number"),
      terms: validateTerms(companyForm.terms),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    const isStudent = accountRole === ROLES.STUDENT;
    if (isStudent ? !validateStudentForm() : !validateCompanyForm()) return;

    const payload = isStudent
      ? {
          role: ROLES.STUDENT,
          fullName: studentForm.fullName,
          email: studentForm.email,
          password: studentForm.password,
          branch: studentForm.branch,
          year: studentForm.year,
        }
      : {
          role: ROLES.COMPANY,
          companyName: companyForm.companyName,
          email: companyForm.email,
          password: companyForm.password,
          industry: companyForm.industry,
          location: companyForm.location,
          website: companyForm.website,
          contactPerson: companyForm.contactPerson,
          phone: companyForm.phone,
        };

    const result = await register(payload);
    if (result.success) {
      navigate(getDashboardPathForRole(result.user?.role), { replace: true });
    }
  }

  const termsChecked = accountRole === ROLES.STUDENT ? studentForm.terms : companyForm.terms;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join GIT CareerAI and start building your placement profile."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div
            className="font-body text-sm text-coral-dark bg-coral-soft border border-coral/20 rounded-xl px-4 py-3"
            role="alert"
          >
            {error}
          </div>
        )}

        <RegisterRoleSelector
          value={accountRole}
          onChange={(role) => {
            setAccountRole(role);
            setFieldErrors({});
            clearError();
          }}
          disabled={isLoading}
        />

        {accountRole === ROLES.STUDENT ? (
          <>
            <FormField
              id="fullName"
              label="Full name"
              value={studentForm.fullName}
              onChange={(e) => updateStudent("fullName", e.target.value)}
              error={fieldErrors.fullName}
              placeholder="Bilal Madre"
              autoComplete="name"
              disabled={isLoading}
            />

            <FormField
              id="email"
              label="Email address"
              type="email"
              value={studentForm.email}
              onChange={(e) => updateStudent("email", e.target.value)}
              error={fieldErrors.email}
              placeholder="you@git.edu"
              autoComplete="email"
              disabled={isLoading}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                id="password"
                label="Password"
                type="password"
                value={studentForm.password}
                onChange={(e) => updateStudent("password", e.target.value)}
                error={fieldErrors.password}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <FormField
                id="confirmPassword"
                label="Confirm password"
                type="password"
                value={studentForm.confirmPassword}
                onChange={(e) => updateStudent("confirmPassword", e.target.value)}
                error={fieldErrors.confirmPassword}
                placeholder="Re-enter password"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                id="branch"
                label="Branch / department"
                as="select"
                value={studentForm.branch}
                onChange={(e) => updateStudent("branch", e.target.value)}
                error={fieldErrors.branch}
                disabled={isLoading}
              >
                <option value="">Select branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </FormField>

              <FormField
                id="year"
                label="Academic year"
                as="select"
                value={studentForm.year}
                onChange={(e) => updateStudent("year", e.target.value)}
                error={fieldErrors.year}
                disabled={isLoading}
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </FormField>
            </div>
          </>
        ) : (
          <>
            <FormField
              id="companyName"
              label="Company name"
              value={companyForm.companyName}
              onChange={(e) => updateCompany("companyName", e.target.value)}
              error={fieldErrors.companyName}
              placeholder="TCS"
              disabled={isLoading}
            />

            <FormField
              id="companyEmail"
              label="Official email"
              type="email"
              value={companyForm.email}
              onChange={(e) => updateCompany("email", e.target.value)}
              error={fieldErrors.email}
              placeholder="hr@company.com"
              autoComplete="email"
              disabled={isLoading}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                id="companyPassword"
                label="Password"
                type="password"
                value={companyForm.password}
                onChange={(e) => updateCompany("password", e.target.value)}
                error={fieldErrors.password}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <FormField
                id="companyConfirmPassword"
                label="Confirm password"
                type="password"
                value={companyForm.confirmPassword}
                onChange={(e) => updateCompany("confirmPassword", e.target.value)}
                error={fieldErrors.confirmPassword}
                placeholder="Re-enter password"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                id="industry"
                label="Industry"
                as="select"
                value={companyForm.industry}
                onChange={(e) => updateCompany("industry", e.target.value)}
                error={fieldErrors.industry}
                disabled={isLoading}
              >
                <option value="">Select industry</option>
                {COMPANY_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </FormField>

              <FormField
                id="location"
                label="Company location"
                value={companyForm.location}
                onChange={(e) => updateCompany("location", e.target.value)}
                error={fieldErrors.location}
                placeholder="Mumbai"
                disabled={isLoading}
              />
            </div>

            <FormField
              id="website"
              label="Website"
              type="url"
              value={companyForm.website}
              onChange={(e) => updateCompany("website", e.target.value)}
              error={fieldErrors.website}
              placeholder="https://www.example.com"
              disabled={isLoading}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                id="contactPerson"
                label="Contact person"
                value={companyForm.contactPerson}
                onChange={(e) => updateCompany("contactPerson", e.target.value)}
                error={fieldErrors.contactPerson}
                placeholder="HR Team"
                disabled={isLoading}
              />
              <FormField
                id="phone"
                label="Phone number"
                type="tel"
                value={companyForm.phone}
                onChange={(e) => updateCompany("phone", e.target.value)}
                error={fieldErrors.phone}
                placeholder="+91 9876543210"
                disabled={isLoading}
              />
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => {
                const v = e.target.checked;
                if (accountRole === ROLES.STUDENT) updateStudent("terms", v);
                else updateCompany("terms", v);
              }}
              className="w-4 h-4 mt-0.5 rounded border-line text-teal focus:ring-teal"
              disabled={isLoading}
            />
            <span className="font-body text-sm text-ink-soft">
              I agree to the terms of service and privacy policy
            </span>
          </label>
          {fieldErrors.terms && (
            <p className="font-body text-xs text-coral" role="alert">
              {fieldErrors.terms}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" loading={isLoading}>
          Create account
        </Button>

        <p className="font-body text-sm text-center text-ink-soft">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal font-medium hover:text-teal-dark underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
