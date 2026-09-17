import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import { COMPANY_NAV_ITEMS } from "../../data/companyMockData.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CompanySidebar({ onNavigate }) {
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
    if (itemPath === "/company/dashboard") {
      return current === "/company/dashboard";
    }
    if (itemPath === "/company/jobs/create") {
      return current === "/company/jobs/create";
    }
    if (itemPath === "/company/jobs") {
      return (
        current === "/company/jobs" ||
        (current.startsWith("/company/jobs/") && current !== "/company/jobs/create")
      );
    }
    if (itemPath === "/company/applicants") {
      return current.startsWith("/company/applicants");
    }
    return current === itemPath || current.startsWith(itemPath + "/");
  }

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col p-5 bg-ink">
      <div className="flex items-center gap-2 mb-8 px-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber">
          <Sparkles size={16} color="#2B1D04" />
        </div>
        <div>
          <div className="font-display text-sm font-semibold text-white leading-tight">
            GIT CareerAI
          </div>
          <div className="font-body text-[10px] text-[#8FA096]">Company Portal</div>
        </div>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {COMPANY_NAV_ITEMS.map((item) => {
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
        className="font-body flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#8FA096] hover:text-[#C7D2CB] hover:bg-white/5 transition-colors"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}
