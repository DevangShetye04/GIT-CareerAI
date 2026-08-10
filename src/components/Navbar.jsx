import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getInitials } from "../utils/validators.js";

export default function Navbar() {
  const { user } = useAuth();

  const displayName = user?.fullName || "Student";
  const firstName = user?.name || displayName.split(/\s+/)[0];
  const branch = user?.branchLabel || user?.branch || "";
  const year = user?.year || "";
  const subtitle = [year, branch].filter(Boolean).join(" · ");

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-line bg-card">
      <div className="font-display text-sm font-semibold text-ink lg:hidden">GIT CareerAI</div>
      <div className="hidden lg:block font-body text-sm text-ink-faint">{subtitle}</div>
      <div className="flex items-center gap-5">
        <button type="button" className="relative" aria-label="Notifications">
          <Bell size={19} className="text-ink-soft" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-coral border-2 border-card" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm font-semibold bg-amber-soft text-amber-dark">
            {getInitials(displayName)}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-body text-sm font-medium text-ink">{displayName}</div>
            <div className="font-body text-xs text-ink-faint">{branch}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
