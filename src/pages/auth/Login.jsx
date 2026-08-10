import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { validateEmail, validatePassword } from "../../utils/validators.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const from = location.state?.from || "/dashboard";

  function validateForm() {
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your career readiness journey."
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

        <FormField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
          }}
          error={fieldErrors.email}
          placeholder="you@git.edu"
          autoComplete="email"
          disabled={isLoading}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
          }}
          error={fieldErrors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-line text-teal focus:ring-teal"
              disabled={isLoading}
            />
            <span className="font-body text-sm text-ink-soft">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="font-body text-sm text-teal hover:text-teal-dark underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isLoading}>
          Sign in
        </Button>

        <p className="font-body text-sm text-center text-ink-soft">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-teal font-medium hover:text-teal-dark underline-offset-2 hover:underline"
          >
            Create account
          </Link>
        </p>

        <p className="font-body text-xs text-center text-ink-faint pt-2">
          Demo: demo@git.edu / password123
        </p>
      </form>
    </AuthLayout>
  );
}
