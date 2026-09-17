import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, ShieldCheck, BarChart3, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getAdminNotifications, subscribe } from "../../services/adminService.js";

export default function AdminNavbar({ onMenuOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const [notifications, setNotifications] = useState(getAdminNotifications);

  useEffect(() => {
    return subscribe(() => {
      setNotifications(getAdminNotifications());
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const adminName = user?.fullName || user?.name || "Placement Cell Admin";
  const adminDesignation = user?.designation || "Placement Cell Admin";
  const placementCellName = user?.placementCell || "Training & Placement Cell";

  const initials =
    adminName
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate("/login", { replace: true });
  }

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
        <div className="hidden lg:block font-body text-sm text-ink-faint truncate">
          {placementCellName} — Central Administration
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-5 shrink-0">
        {/* Notifications Icon with dynamic badge */}
        <Link
          to="/admin/notifications"
          className="relative p-1.5 rounded-lg hover:bg-paper-dim transition-colors"
          aria-label="Admin Notifications"
        >
          <Bell size={19} className="text-ink-soft" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-coral border-2 border-card" />
          )}
        </Link>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 sm:gap-2.5 rounded-xl py-1 pr-1 pl-1 hover:bg-paper-dim transition-colors"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-bold bg-teal-soft text-teal-dark shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-tight max-w-[170px]">
              <div className="font-body text-sm font-medium text-ink truncate">{adminName}</div>
              <div className="font-body text-xs text-ink-faint">{adminDesignation}</div>
            </div>
            <ChevronDown size={16} className="text-ink-faint hidden sm:block" />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl bg-card border border-line shadow-card py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              role="menu"
            >
              <div className="px-3 py-2 border-b border-line sm:hidden">
                <div className="font-body text-sm font-semibold text-ink truncate">{adminName}</div>
                <div className="font-body text-xs text-ink-faint">{adminDesignation}</div>
              </div>

              <Link
                to="/admin/reports"
                className="flex items-center gap-2 px-3 py-2.5 font-body text-sm text-ink-soft hover:bg-paper-dim"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <BarChart3 size={16} /> Placement Reports
              </Link>
              <Link
                to="/admin/job-approvals"
                className="flex items-center gap-2 px-3 py-2.5 font-body text-sm text-ink-soft hover:bg-paper-dim"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <ShieldCheck size={16} /> Job Approvals
              </Link>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2.5 font-body text-sm text-coral hover:bg-coral-soft text-left"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
