import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import RoleSelector from "../../components/ui/RoleSelector.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { validateEmail } from "../../utils/validators.js";
import { normalizeRole, ROLES } from "../../utils/roles.js";

export default function ForgotPassword() {
  const location = useLocation();
  const { forgotPassword, isLoading, error, clearError } = useAuth();

  const [accountRole, setAccountRole] = useState(
    normalizeRole(location.state?.role) || ROLES.STUDENT
  );
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();

    const emailError = validateEmail(email);
    setFieldError(emailError);
    if (emailError) return;

    const result = await forgotPassword(email, accountRole);
    if (result.success) {
      setSuccessMessage(result.message);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <AuthLayout title="Check your email" subtitle="">
        <div className="rounded-2xl bg-teal-soft border border-teal/20 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-teal/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={24} className="text-teal" />
          </div>
          <p className="font-body text-sm text-teal-dark font-medium">{successMessage}</p>
          <p className="font-body text-xs text-ink-soft mt-2">
            Reset instructions were simulated for <span className="font-medium text-ink">{email}</span>.
          </p>
          <p className="font-body text-[11px] text-ink-faint mt-3 bg-card/60 p-2.5 rounded-xl border border-line">
            Demo Notice: In this frontend evaluation environment, real email delivery is simulated. Your demo credentials remain active and you can sign in directly.
          </p>
        </div>
        <Link
          to="/login"
          className="mt-6 inline-flex font-body text-sm text-teal font-medium hover:text-teal-dark underline-offset-2 hover:underline"
        >
          Back to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div
            className="font-body text-sm text-coral-dark bg-coral-soft border border-coral/20 rounded-xl px-4 py-3"
            role="alert"
          >
            {error}
          </div>
        )}

        <RoleSelector
          value={accountRole}
          onChange={setAccountRole}
          disabled={isLoading}
          legend="Account type"
        />

        <FormField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldError) setFieldError("");
          }}
          error={fieldError}
          placeholder={
            accountRole === ROLES.ADMIN
              ? "admin@git.edu"
              : accountRole === ROLES.COMPANY
              ? "recruiter@tcs.com"
              : "student@git.edu"
          }
          autoComplete="email"
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" loading={isLoading}>
          Send reset link
        </Button>

        <p className="font-body text-sm text-center">
          <Link
            to="/login"
            className="text-teal font-medium hover:text-teal-dark underline-offset-2 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
