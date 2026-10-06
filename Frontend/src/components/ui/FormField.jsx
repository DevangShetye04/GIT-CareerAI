import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  disabled = false,
  as = "input",
  children,
  className = "",
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const errorId = error ? `${id}-error` : undefined;

  const baseInputClass =
    "w-full font-body text-sm text-ink bg-card border rounded-xl px-3.5 py-2.5 transition-colors placeholder:text-ink-faint disabled:opacity-60 disabled:cursor-not-allowed";

  const borderClass = error
    ? "border-coral focus:border-coral"
    : "border-line focus:border-teal";

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className="block font-body text-sm font-medium text-ink-soft">
        {label}
      </label>

      {as === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`${baseInputClass} ${borderClass} appearance-none`}
          {...rest}
        >
          {children}
        </select>
      ) : (
        <div className="relative">
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={`${baseInputClass} ${borderClass} ${isPassword ? "pr-10" : ""}`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-soft"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      )}

      {error && (
        <p id={errorId} className="font-body text-xs text-coral" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
