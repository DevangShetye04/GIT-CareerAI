import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import CompanyDashboardLayout from "./layouts/CompanyDashboardLayout.jsx";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout.jsx";

// Auth Pages
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentProfile from "./pages/student/StudentProfile.jsx";
import StudentResume from "./pages/student/StudentResume.jsx";
import StudentJobs from "./pages/student/StudentJobs.jsx";
import StudentJobDetails from "./pages/student/StudentJobDetails.jsx";
import StudentApplications from "./pages/student/StudentApplications.jsx";
import StudentInterviews from "./pages/student/StudentInterviews.jsx";
import StudentCareer from "./pages/student/StudentCareer.jsx";
import StudentSkillGap from "./pages/student/StudentSkillGap.jsx";
import StudentNotifications from "./pages/student/StudentNotifications.jsx";

// Company Pages (Preserved)
import CompanyDashboard from "./pages/company/CompanyDashboard.jsx";
import CompanyProfile from "./pages/company/CompanyProfile.jsx";
import CompanyJobs from "./pages/company/CompanyJobs.jsx";
import CreateJob from "./pages/company/CreateJob.jsx";
import CompanyJobDetails from "./pages/company/CompanyJobDetails.jsx";
import CompanyApplicants from "./pages/company/CompanyApplicants.jsx";
import CandidateDetails from "./pages/company/CandidateDetails.jsx";
import ShortlistedCandidates from "./pages/company/ShortlistedCandidates.jsx";
import CompanyNotifications from "./pages/company/CompanyNotifications.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentManagement from "./pages/admin/StudentManagement.jsx";
import CompanyManagement from "./pages/admin/CompanyManagement.jsx";
import JobApprovals from "./pages/admin/JobApprovals.jsx";
import PlacementDrives from "./pages/admin/PlacementDrives.jsx";
import Applications from "./pages/admin/Applications.jsx";
import Placements from "./pages/admin/Placements.jsx";
import Reports from "./pages/admin/Reports.jsx";
import AdminNotifications from "./pages/admin/AdminNotifications.jsx";

import { getDashboardPathForRole } from "./utils/roles.js";

function RootRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="font-body text-sm text-ink-faint">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPathForRole(user?.role)} replace />;
}

function StudentRoute({ children }) {
  return <ProtectedRoute allowedRoles={["student"]}>{children}</ProtectedRoute>;
}

function CompanyRoute({ children }) {
  return <ProtectedRoute allowedRoles={["company"]}>{children}</ProtectedRoute>;
}

function AdminRoute({ children }) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Public Auth Routes */}
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

      {/* ------------------------------------------------------------- */}
      {/* Student Portal Routes (All 9 pages connected)                 */}
      {/* ------------------------------------------------------------- */}
      <Route
        path="/dashboard"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentProfile />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentResume />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentJobs />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentJobDetails />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentApplications />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/interviews"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentInterviews />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/career"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentCareer />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/skill-gap"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentSkillGap />
            </DashboardLayout>
          </StudentRoute>
        }
      />
      {/* Fallback alias for skillgap */}
      <Route path="/skillgap" element={<Navigate to="/skill-gap" replace />} />
      <Route path="/companies" element={<Navigate to="/jobs" replace />} />
      <Route
        path="/notifications"
        element={
          <StudentRoute>
            <DashboardLayout>
              <StudentNotifications />
            </DashboardLayout>
          </StudentRoute>
        }
      />

      {/* ------------------------------------------------------------- */}
      {/* Company Recruitment Portal Routes (Preserved Exactly)        */}
      {/* ------------------------------------------------------------- */}
      <Route
        path="/company/dashboard"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <CompanyDashboard />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/profile"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <CompanyProfile />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/jobs"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <CompanyJobs />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/jobs/create"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <CreateJob />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/jobs/:id"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <CompanyJobDetails />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/applicants"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <CompanyApplicants />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/applicants/:id"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <CandidateDetails />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/shortlisted"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <ShortlistedCandidates />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />
      <Route
        path="/company/notifications"
        element={
          <CompanyRoute>
            <CompanyDashboardLayout>
              <CompanyNotifications />
            </CompanyDashboardLayout>
          </CompanyRoute>
        }
      />

      {/* ------------------------------------------------------------- */}
      {/* Placement Cell Admin Portal Routes                            */}
      {/* ------------------------------------------------------------- */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <AdminDashboard />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <StudentManagement />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <CompanyManagement />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/job-approvals"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <JobApprovals />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/placement-drives"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <PlacementDrives />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />
      {/* Route alias for drives */}
      <Route path="/admin/drives" element={<Navigate to="/admin/placement-drives" replace />} />
      <Route
        path="/admin/applications"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <Applications />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/placements"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <Placements />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <Reports />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <AdminRoute>
            <AdminDashboardLayout>
              <AdminNotifications />
            </AdminDashboardLayout>
          </AdminRoute>
        }
      />

      {/* Fallback */}
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
