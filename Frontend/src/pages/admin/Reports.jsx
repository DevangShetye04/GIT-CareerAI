import { useState } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  Award,
  Building2,
  GraduationCap,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import { getReportsData } from "../../services/adminService.js";

export default function Reports() {
  const [report] = useState(getReportsData());
  const [toast, setToast] = useState("");

  const handleExport = (type) => {
    setToast(`Generating ${type} placement report... (Demo Simulation: Preparing official export data)`);
    setTimeout(() => {
      setToast(`(Demo Simulation) ${type} placement audit report compiled successfully!`);
    }, 1200);
    setTimeout(() => setToast(""), 4000);
  };

  const { kpis, branchBreakdown, salaryTiers, topRecruiters } = report;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Placement Reports
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Department-level placement metrics, salary distribution bands, corporate recruiter volumes, and compliance reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="!py-2 !px-3 !text-xs"
            onClick={() => handleExport("PDF")}
          >
            <Download size={14} /> Export Report
          </Button>
          <Button
            variant="primary"
            className="!py-2 !px-3 !text-xs"
            onClick={() => handleExport("Excel")}
          >
            <FileSpreadsheet size={14} /> Export Excel
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

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!p-4">
          <span className="text-xs font-body text-ink-faint">Overall Placement Rate</span>
          <div className="font-mono text-2xl font-bold text-teal-dark mt-1">
            {kpis.placementRate}
          </div>
          <span className="text-[11px] font-body text-ink-soft">
            {kpis.placedCount} / {kpis.totalRegistered} registered
          </span>
        </Card>

        <Card className="!p-4">
          <span className="text-xs font-body text-ink-faint">Highest Campus CTC</span>
          <div className="font-mono text-2xl font-bold text-ink mt-1">
            {kpis.highestPackage}
          </div>
          <span className="text-[11px] font-body text-ink-soft">
            {kpis.highestPackageCompany}
          </span>
        </Card>

        <Card className="!p-4">
          <span className="text-xs font-body text-ink-faint">Average Batch Package</span>
          <div className="font-mono text-2xl font-bold text-ink mt-1">
            {kpis.averagePackage}
          </div>
          <span className="text-[11px] font-body text-ink-soft">
            Median: {kpis.medianPackage}
          </span>
        </Card>

        <Card className="!p-4">
          <span className="text-xs font-body text-ink-faint">Recruiters Visited</span>
          <div className="font-mono text-2xl font-bold text-ink mt-1">
            {kpis.totalCompaniesVisited}
          </div>
          <span className="text-[11px] font-body text-ink-soft">
            On-campus &amp; virtual drives
          </span>
        </Card>
      </div>

      {/* Two Column Section: Branch-wise Breakdown & Salary Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch-wise Performance */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <GraduationCap size={18} /> Branch Placement Distribution
            </h3>
            <Pill tone="teal">2026 Batch</Pill>
          </div>

          <div className="space-y-4">
            {branchBreakdown.map((b, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-body">
                  <span className="font-medium text-ink truncate max-w-[240px]">
                    {b.branch}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-ink-soft">
                      {b.placed}/{b.total} Placed
                    </span>
                    <span className="font-semibold text-teal-dark">{b.rate}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-paper-dim overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      b.rate >= 80 ? "bg-teal" : b.rate >= 65 ? "bg-amber" : "bg-coral"
                    }`}
                    style={{ width: `${b.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Salary Tiers */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <Award size={18} /> Salary Band Breakdown
            </h3>
            <span className="font-mono text-xs text-ink-soft">Total 323 Offers</span>
          </div>

          <div className="space-y-4">
            {salaryTiers.map((tier, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-body">
                  <span className="font-medium text-ink">{tier.tier}</span>
                  <span className="font-mono text-ink-soft">
                    {tier.count} Students ({tier.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-paper-dim overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${tier.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-line text-xs font-body text-ink-soft">
            <div className="flex justify-between">
              <span>National Accreditation Board (NBA) Metric</span>
              <span className="font-mono font-medium text-teal-dark">Tier-1 Compliant</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Hirers Ranking Table */}
      <Card padded={false} className="overflow-hidden">
        <div className="p-5 pb-3">
          <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
            <Building2 size={18} /> Top Campus Recruiters (By Hires)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body text-xs">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-ink-soft">
                <th className="py-3 px-4 font-semibold">Rank</th>
                <th className="py-3 px-4 font-semibold">Recruiting Organization</th>
                <th className="py-3 px-4 font-semibold">Offers Made</th>
                <th className="py-3 px-4 font-semibold">Average Package</th>
                <th className="py-3 px-4 font-semibold">Partnership Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {topRecruiters.map((rec, idx) => (
                <tr key={idx} className="hover:bg-paper-dim/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-ink">#{idx + 1}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink text-sm">
                    {rec.company}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-dark">
                    {rec.hires} Placements
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink font-medium">
                    {rec.avgPackage}
                  </td>
                  <td className="py-3.5 px-4">
                    <Pill tone="teal">Tier-1 Partner</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
