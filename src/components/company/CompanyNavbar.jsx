import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, Settings, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getInitials } from "../../utils/validators.js";
import {
  getCompanyProfile,
  getNotifications,
  subscribe,
} from "../../services/companyService.js";

export default function CompanyNavbar({ onMenuOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const [profile, setProfile] = useState(getCompanyProfile);
  const [notifications, setNotifications] = useState(getNotifications);

  useEffect(() => {
    return subscribe(() => {
      setProfile(getCompanyProfile());
      setNotifications(getNotifications());
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const companyName = profile?.companyName || user?.companyName || user?.fullName || "TCS";

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
          Campus Placement & Recruitment Portal
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-5 shrink-0">
        {/* Notifications Icon with dynamic badge */}
        <Link
          to="/company/notifications"
          className="relative p-1.5 rounded-lg hover:bg-paper-dim transition-colors"
          aria-label="Notifications"
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
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-bold bg-amber-soft text-amber-dark shrink-0">
              {profile?.shortName || getInitials(companyName)}
            </div>
            <div className="hidden sm:block text-left leading-tight max-w-[150px]">
              <div className="font-body text-sm font-medium text-ink truncate">{companyName}</div>
              <div className="font-body text-xs text-ink-faint">Recruiter Portal</div>
            </div>
            <ChevronDown size={16} className="text-ink-faint hidden sm:block" />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-line shadow-card py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              role="menu"
            >
              <div className="px-3 py-2 border-b border-line sm:hidden">
                <div className="font-body text-sm font-semibold text-ink truncate">{companyName}</div>
                <div className="font-body text-xs text-ink-faint">Recruiter Portal</div>
              </div>

              <Link
                to="/company/profile"
                className="flex items-center gap-2 px-3 py-2.5 font-body text-sm text-ink-soft hover:bg-paper-dim"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <Building2 size={16} /> Company Profile
              </Link>
              <Link
                to="/company/jobs"
                className="flex items-center gap-2 px-3 py-2.5 font-body text-sm text-ink-soft hover:bg-paper-dim"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <Settings size={16} /> Manage Jobs
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
