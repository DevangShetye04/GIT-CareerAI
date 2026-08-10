import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "../data/mockData.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="w-64 shrink-0 h-full flex-col p-5 hidden lg:flex bg-ink">
      <div className="flex items-center gap-2 mb-8 px-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber">
          <Sparkles size={16} color="#2B1D04" />
        </div>
        <div>
          <div className="font-display text-sm font-semibold text-white leading-tight">
            GIT CareerAI
          </div>
          <div className="font-body text-[10px] text-[#8FA096]">Career Intelligence</div>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `font-body w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                  isActive
                    ? "bg-amber/15 text-amber"
                    : "text-[#C7D2CB] hover:bg-white/5"
                }`
              }
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
