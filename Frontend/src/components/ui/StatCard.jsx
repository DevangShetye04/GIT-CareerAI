import { Link } from "react-router-dom";
import Card from "./Card.jsx";

export default function StatCard({
  label,
  value,
  suffix = "",
  tone = "teal",
  icon: Icon,
  note,
  actionLabel,
  actionTo,
}) {
  const toneIcon = {
    amber: "bg-amber-soft text-amber",
    teal: "bg-teal-soft text-teal",
    coral: "bg-coral-soft text-coral",
  };
  const toneNote = {
    amber: "text-amber",
    teal: "text-teal",
    coral: "text-coral",
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-xs text-ink-faint">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneIcon[tone]}`}>
            <Icon size={15} />
          </div>
        )}
      </div>
      <div
        className={`font-display font-semibold leading-tight ${String(value).length > 6 ? "text-base" : "text-2xl"} text-ink`}
      >
        {value}
        {suffix && <span className="font-body text-sm font-normal text-ink-faint">{suffix}</span>}
      </div>
      {note && <div className={`font-body text-xs mt-1.5 ${toneNote[tone]}`}>{note}</div>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="font-body text-xs text-teal hover:text-teal-dark mt-2 inline-block underline-offset-2 hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </Card>
  );
}
