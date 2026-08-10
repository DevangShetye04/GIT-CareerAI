const TONE_MAP = {
  neutral: "bg-paper-dim text-ink-soft",
  amber: "bg-amber-soft text-amber-dark",
  teal: "bg-teal-soft text-teal-dark",
  coral: "bg-coral-soft text-coral-dark",
};

export default function Pill({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`font-body text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap ${TONE_MAP[tone] || TONE_MAP.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
