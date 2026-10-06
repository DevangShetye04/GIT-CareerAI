import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getDashboardPathForRole, normalizeRole } from "../utils/roles.js";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="font-body text-sm text-ink-faint">Loading session…</div>
    </div>
  );
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles?.length) {
    const userRole = normalizeRole(user?.role);
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={getDashboardPathForRole(userRole)} replace />;
    }
  }

  return children;
}

export function PublicRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="font-body text-sm text-ink-faint">Loading…</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getDashboardPathForRole(user?.role)} replace />;
  }

  return children;
}
