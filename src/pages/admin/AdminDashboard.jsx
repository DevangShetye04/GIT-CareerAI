import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  CheckSquare,
  Calendar,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  FileText,
  Download,
  ShieldAlert,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import {
  getAdminStats,
  getJobApprovals,
  getPlacementDrives,
  getPlacements,
  approveJob,
  subscribe,
} from "../../services/adminService.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getAdminStats());
  const [approvals, setApprovals] = useState(() => getJobApprovals("Pending"));
  const [drives, setDrives] = useState(getPlacementDrives());
  const [placements, setPlacements] = useState(getPlacements());
  const [toast, setToast] = useState("");

  useEffect(() => {
    const unsub = subscribe(() => {
      setStats(getAdminStats());
      setApprovals(getJobApprovals("Pending"));
      setDrives(getPlacementDrives());
      setPlacements(getPlacements());
    });
    return () => unsub();
  }, []);

  const handleApprove = (id) => {
    approveJob(id);
    setToast(`Job opening #${id} approved successfully!`);
    setTimeout(() => setToast(""), 3500);
  };

  const statCards = [
    {
      label: "Total Registered",
      value: `${stats.totalStudents}`,
      trend: "4 Branches",
      tone: "neutral",
      icon: Users,
    },
    {
      label: "Placement Rate",
      value: stats.placementRate,
      trend: "+8.4% vs 2025",
      tone: "teal",
      icon: TrendingUp,
    },
    {
      label: "Partner Companies",
      value: `${stats.registeredCompanies}`,
      trend: "Active Campus Hirers",
      tone: "neutral",
      icon: Building2,
    },
    {
      label: "Pending Approvals",
      value: `${stats.pendingApprovals}`,
      trend: "Requires T&P Review",
      tone: stats.pendingApprovals > 0 ? "amber" : "teal",
      icon: CheckSquare,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Placement Cell Dashboard
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Centralized monitoring of campus drives, corporate recruitment pipelines, student eligibility, and verified placements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            className="!py-2 !px-3 !text-xs"
            onClick={() => navigate("/admin/reports")}
          >
            <Download size={14} /> Export Report
          </Button>
          <Button
            variant="primary"
            className="!py-2 !px-3 !text-xs"
            onClick={() => navigate("/admin/placement-drives")}
          >
            <Calendar size={14} /> Schedule Drive
          </Button>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-teal-soft text-teal-dark border border-teal/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={18} />
            <span>{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast("")}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Pending Job Approvals Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-dark" />
            <h2 className="font-display text-base font-semibold text-ink">
              Job Postings Pending Approval ({approvals.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/job-approvals")}
            className="font-body text-xs underline text-ink-soft hover:text-ink cursor-pointer"
          >
            View all approvals
          </button>
        </div>

        {approvals.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 size={32} className="mx-auto text-teal mb-2" />
            <p className="font-display text-sm font-semibold text-ink">All caught up!</p>
            <p className="font-body text-xs text-ink-soft mt-0.5">
              No corporate job postings are currently pending placement cell verification.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvals.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl border border-line bg-card hover:border-ink/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm font-semibold text-ink">{job.title}</h3>
                    <Pill tone="amber">Awaiting Approval</Pill>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-body text-ink-soft mt-1">
                    <span className="font-medium text-ink flex items-center gap-1">
                      <Building2 size={12} /> {job.company}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-ink">{job.ctc}</span>
                    <span>•</span>
                    <span>Min CGPA: {job.minCgpa}</span>
                    <span>•</span>
                    <span>Max Backlogs: {job.allowedBacklogs}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    className="!py-1.5 !px-3 !text-xs"
                    onClick={() => navigate(`/admin/job-approvals?highlight=${job.id}`)}
                  >
                    Inspect Details
                  </Button>
                  <Button
                    variant="primary"
                    className="!py-1.5 !px-3 !text-xs"
                    onClick={() => handleApprove(job.id)}
                  >
                    <CheckCircle2 size={13} /> Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Two Column Grid: Upcoming Drives & Recent Placements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Placement Drives */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <Calendar size={18} /> Upcoming Campus Drives
            </h3>
            <button
              type="button"
              onClick={() => navigate("/admin/placement-drives")}
              className="font-body text-xs underline text-ink-soft hover:text-ink cursor-pointer"
            >
              Manage drives
            </button>
          </div>

          <div className="space-y-3">
            {drives.slice(0, 4).map((drv) => (
              <div
                key={drv.id}
                className="p-3.5 rounded-xl border border-line flex items-center justify-between gap-3 hover:bg-paper-dim/30 transition-colors"
              >
                <div>
                  <h4 className="font-display text-sm font-semibold text-ink">{drv.driveName}</h4>
                  <div className="flex items-center gap-2 text-xs font-body text-ink-soft mt-0.5">
                    <span className="font-medium text-ink">{drv.company}</span>
                    <span>•</span>
                    <span className="font-mono">{drv.dateLabel || drv.date}</span>
                    <span>•</span>
                    <span>{drv.venue}</span>
                  </div>
                </div>
                <Pill tone={drv.status === "Scheduled" ? "teal" : "neutral"}>
                  {drv.status}
                </Pill>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Placements Ledger */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <Award size={18} className="text-teal" /> Latest Confirmed Placements
            </h3>
            <button
              type="button"
              onClick={() => navigate("/admin/placements")}
              className="font-body text-xs underline text-ink-soft hover:text-ink cursor-pointer"
            >
              Full ledger
            </button>
          </div>

          <div className="space-y-3">
            {placements.slice(0, 4).map((plc) => (
              <div
                key={plc.id}
                className="p-3.5 rounded-xl border border-line flex items-center justify-between gap-3 hover:bg-paper-dim/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-semibold text-ink">
                      {plc.studentName}
                    </h4>
                    <span className="font-mono text-[11px] text-ink-faint">({plc.rollNo})</span>
                  </div>
                  <div className="text-xs font-body text-ink-soft mt-0.5">
                    {plc.role} at <span className="font-medium text-ink">{plc.company}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-ink">{plc.ctc}</div>
                  <div className="text-[10px] font-mono text-teal-dark font-medium">
                    {plc.placementDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
