import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  Sparkles,
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  ClipboardList,
  Calendar,
  Compass,
  Target,
  Bell,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export const STUDENT_NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { key: "profile", label: "My Profile", icon: User, path: "/profile" },
  { key: "resume", label: "Resume & ATS", icon: FileText, path: "/resume" },
  { key: "jobs", label: "Browse Jobs", icon: Briefcase, path: "/jobs" },
  { key: "applications", label: "My Applications", icon: ClipboardList, path: "/applications" },
  { key: "interviews", label: "Interviews", icon: Calendar, path: "/interviews" },
  { key: "career", label: "Career Path", icon: Compass, path: "/career" },
  { key: "skillgap", label: "Skill Gap", icon: Target, path: "/skill-gap" },
  { key: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
];

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  function handleNavClick() {
    onNavigate?.();
  }

  function checkIsActive(itemPath) {
    const current = location.pathname;
    if (itemPath === "/dashboard") {
      return current === "/dashboard";
    }
    if (itemPath === "/jobs") {
      return current === "/jobs" || (current.startsWith("/jobs/") && !current.startsWith("/jobs/create"));
    }
    if (itemPath === "/skill-gap") {
      return current === "/skill-gap" || current === "/skillgap";
    }
    return current === itemPath || current.startsWith(itemPath + "/");
  }

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col p-5 bg-ink">
      <div className="flex items-center gap-2 mb-6 px-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber">
          <Sparkles size={16} color="#2B1D04" />
        </div>
        <div>
          <div className="font-display text-sm font-semibold text-white leading-tight">
            GIT CareerAI
          </div>
          <div className="font-body text-[10px] text-[#8FA096]">Student Portal</div>
        </div>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {STUDENT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item.path);
          return (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={handleNavClick}
              className={`font-body w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                isActive
                  ? "bg-amber/15 text-amber font-medium"
                  : "text-[#C7D2CB] hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="font-body flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#8FA096] hover:text-[#C7D2CB] hover:bg-white/5 transition-colors mt-2"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}

