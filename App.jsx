import DashboardLayout from "./layouts/DashboardLayout.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";

export default function App() {
  return (
    <DashboardLayout>
      <StudentDashboard />
    </DashboardLayout>
  );
}
