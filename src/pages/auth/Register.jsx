import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { BRANCHES, YEARS } from "../../data/mockData.js";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validateTerms,
} from "../../utils/validators.js";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    year: "",
    terms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    }
  }

  function validateForm() {
    const errors = {
      fullName: validateRequired(form.fullName, "Full name"),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
      branch: validateRequired(form.branch, "Branch / department"),
      year: validateRequired(form.year, "Year"),
      terms: validateTerms(form.terms),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;

    const result = await register({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      branch: form.branch,
      year: form.year,
    });

    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  }

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

        <FormField
          id="fullName"
          label="Full name"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          error={fieldErrors.fullName}
          placeholder="Bilal Shaikh"
          autoComplete="name"
          disabled={isLoading}
        />

        <FormField
          id="email"
          label="Email address"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
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
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            error={fieldErrors.password}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            disabled={isLoading}
          />
          <FormField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
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
            value={form.branch}
            onChange={(e) => updateField("branch", e.target.value)}
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
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
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

        <div className="space-y-1.5">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => updateField("terms", e.target.checked)}
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
