import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import CompanySummaryCards from "../../components/company/CompanySummaryCards.jsx";
import JobsOverview from "../../components/company/JobsOverview.jsx";
import RecentApplicants from "../../components/company/RecentApplicants.jsx";
import EligibilityOverview from "../../components/company/EligibilityOverview.jsx";
import RecentActivity from "../../components/company/RecentActivity.jsx";
import QuickActions from "../../components/company/QuickActions.jsx";
import { getCompanyProfile, subscribe } from "../../services/companyService.js";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(getCompanyProfile);

  useEffect(() => {
    return subscribe(() => {
      setProfile(getCompanyProfile());
    });
  }, []);

  const companyDisplayName =
    profile?.shortName || profile?.companyName || user?.companyName || user?.name || "TCS";

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Welcome back, {companyDisplayName}! 👋
          </h1>
          <p className="font-body text-sm mt-1 text-ink-soft">
            Manage your job openings and find the right candidates for your organization.
          </p>
        </div>
        <Link to="/company/jobs/create" className="shrink-0">
          <Button variant="primary" className="w-full sm:w-auto justify-center">
            <Plus size={16} /> Post New Job
          </Button>
        </Link>
      </div>

      {/* Pending Verification Notice */}
      {user?.status === "Pending Verification" && (
        <div className="p-4 rounded-xl bg-amber-soft border border-amber/30 text-amber-dark flex items-center gap-3">
          <Clock size={20} className="shrink-0 text-amber" />
          <div className="text-sm font-body">
            <span className="font-semibold font-display">Recruiter Account Pending Verification: </span>
            Your corporate profile is currently under review by the Gharda Institute of Technology T&amp;P Cell. Campus placement drives and job postings will be fully active once institutional verification is completed.
          </div>
        </div>
      )}

      {/* KPI Summary Cards */}
      <CompanySummaryCards />

      {/* Jobs Overview */}
      <JobsOverview />

      {/* Recent Applicants Table */}
      <RecentApplicants />

      {/* Screening & Eligibility / ATS Overview */}
      <EligibilityOverview />

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}
