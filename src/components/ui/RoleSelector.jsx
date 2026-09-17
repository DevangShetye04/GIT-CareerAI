import { ROLES } from "../../utils/roles.js";

const LOGIN_OPTIONS = [
  { value: ROLES.STUDENT, label: "Student" },
  { value: ROLES.COMPANY, label: "Company" },
  { value: ROLES.ADMIN, label: "Placement Admin" },
];

const REGISTER_OPTIONS = [
  { value: ROLES.STUDENT, label: "Student" },
  { value: ROLES.COMPANY, label: "Company" },
];

export default function RoleSelector({
  value,
  onChange,
  disabled = false,
  legend = "Login as",
  options = LOGIN_OPTIONS,
}) {
  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="font-body text-sm font-medium text-ink-soft">{legend}</legend>
      <div className="flex gap-2 p-1 rounded-xl bg-paper-dim border border-line">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 font-body text-xs sm:text-sm font-medium py-2 px-2.5 rounded-lg transition-colors text-center whitespace-nowrap ${
                selected
                  ? "bg-card text-ink shadow-sm border border-line font-semibold"
                  : "text-ink-soft hover:text-ink"
              }`}
              aria-pressed={selected}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function RegisterRoleSelector(props) {
  return <RoleSelector legend="Register as" options={REGISTER_OPTIONS} {...props} />;
}

