import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getInitials } from "../utils/validators.js";
import { getStudentNotifications, subscribe } from "../services/studentService.js";

export default function Navbar({ onMenuOpen }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(getStudentNotifications);

  useEffect(() => {
    return subscribe(() => {
      setNotifications(getStudentNotifications());
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayName = user?.fullName || user?.name || "Bilal Madre";
  const branch = user?.branchLabel || user?.branch || "Computer Engineering";
  const year = user?.year || "4th Year";
  const subtitle = [year, branch].filter(Boolean).join(" · ");

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-line bg-card gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="lg:hidden p-2 -ml-1 rounded-lg text-ink-soft hover:bg-paper-dim"
          onClick={onMenuOpen}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="font-display text-sm font-semibold text-ink lg:hidden truncate">
          GIT CareerAI
        </div>
        <div className="hidden lg:block font-body text-sm text-ink-faint truncate">{subtitle}</div>
      </div>

      <div className="flex items-center gap-4 sm:gap-5 shrink-0">
        <Link
          to="/notifications"
          className="relative p-1.5 rounded-lg hover:bg-paper-dim transition-colors"
          aria-label="Notifications"
        >
          <Bell size={19} className="text-ink-soft" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-coral border-2 border-card" />
          )}
        </Link>

        <Link to="/profile" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm font-semibold bg-amber-soft text-amber-dark">
            {getInitials(displayName)}
          </div>
          <div className="hidden sm:block leading-tight text-left">
            <div className="font-body text-sm font-medium text-ink">{displayName}</div>
            <div className="font-body text-xs text-ink-faint">{branch}</div>
          </div>
        </Link>
      </div>
    </header>
  );
}

