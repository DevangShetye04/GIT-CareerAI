import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-ink text-paper hover:opacity-90",
  accent: "bg-amber text-[#2B1D04] hover:opacity-90",
  ghost: "bg-transparent text-ink border border-line hover:bg-paper-dim",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`font-body text-sm font-medium px-4 py-2.5 rounded-xl inline-flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
}
