import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="font-body text-sm text-ink-faint">Loading…</div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="My Profile" description="Manage your personal and academic details." />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Resume & ATS Analysis" description="Upload and analyze your resume for ATS compatibility." />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/career"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Career Recommendations" description="Explore AI-matched career paths for your profile." />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skillgap"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Skill Gap & Roadmap" description="Identify missing skills and follow your learning roadmap." />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Recommended Companies" description="Browse companies matched to your eligibility and skills." />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="My Applications" description="Track all your job and internship applications." />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
