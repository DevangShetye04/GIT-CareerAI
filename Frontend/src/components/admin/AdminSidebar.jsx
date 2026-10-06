import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "../../data/adminMockData.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminSidebar({ onNavigate }) {
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
    if (itemPath === "/admin/dashboard") {
      return current === "/admin/dashboard";
    }
    return current === itemPath || current.startsWith(itemPath + "/");
  }

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col p-5 bg-ink">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8 px-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal text-paper">
          <ShieldCheck size={18} />
        </div>
        <div>
          <div className="font-display text-sm font-semibold text-white leading-tight">
            GIT CareerAI
          </div>
          <div className="font-body text-[10px] text-[#8FA096] uppercase tracking-wider font-semibold">
            Placement Cell Admin
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item.path);
          return (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={handleNavClick}
              className={`font-body w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                isActive
                  ? "bg-teal/20 text-teal-light font-medium"
                  : "text-[#C7D2CB] hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
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
