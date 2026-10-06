import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminNavbar from "../components/admin/AdminNavbar.jsx";

export default function AdminDashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex bg-paper overflow-x-hidden">
      <div className="hidden lg:flex shrink-0 h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 z-50 h-full">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
