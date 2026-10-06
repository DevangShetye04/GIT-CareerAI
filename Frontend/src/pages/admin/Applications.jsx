import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  Building2,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getCollegeApplications,
  subscribe,
} from "../../services/adminService.js";

const STATUS_TONES = {
  Applied: "amber",
  Shortlisted: "teal",
  "Interview Scheduled": "teal",
  "Technical Round": "teal",
  Selected: "teal",
  Rejected: "coral",
};

export default function Applications() {
  const [applications, setApplications] = useState(getCollegeApplications());
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const unsub = subscribe(() => {
      setApplications(getCollegeApplications());
    });
    return () => unsub();
  }, []);

  const companiesList = useMemo(() => {
    const set = new Set(applications.map((a) => a.company));
    return Array.from(set);
  }, [applications]);

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (branchFilter !== "All" && app.branch !== branchFilter) return false;
      if (companyFilter !== "All" && app.company !== companyFilter) return false;
      if (statusFilter !== "All" && app.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase().trim();
        const match =
          app.studentName.toLowerCase().includes(q) ||
          app.rollNo.toLowerCase().includes(q) ||
          app.company.toLowerCase().includes(q) ||
          app.role.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [applications, search, branchFilter, companyFilter, statusFilter]);

  const shortlistedCount = filteredApps.filter(
    (a) => a.status === "Shortlisted" || a.status === "Interview Scheduled"
  ).length;
  const selectedCount = filteredApps.filter((a) => a.status === "Selected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Applications
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Real-time aggregate of all student submissions across campus recruiters with live ATS screening metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Pill tone="teal" className="text-xs">
            {selectedCount} Selected • {shortlistedCount} Shortlisted
          </Pill>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="!p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              placeholder="Search by student name, roll number, company, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="All">All Branches</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Telecommunication">Electronics &amp; Telecom</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>

            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="All">All Recruiters</option>
              {companiesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="All">All Application Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body text-xs">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-ink-soft">
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Branch &amp; CGPA</th>
                <th className="py-3 px-4 font-semibold">Applied Role &amp; Recruiter</th>
                <th className="py-3 px-4 font-semibold">ATS Score</th>
                <th className="py-3 px-4 font-semibold">Submission Date</th>
                <th className="py-3 px-4 font-semibold">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-ink-soft">
                    No applications found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-paper-dim/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-sm text-ink">{app.studentName}</div>
                      <div className="font-mono text-[11px] text-ink-faint">{app.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-soft">
                      <div className="font-medium text-ink">{app.branch}</div>
                      <div className="font-mono text-[11px]">CGPA {app.cgpa}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink">{app.role}</div>
                      <div className="font-medium text-ink-soft flex items-center gap-1 text-[11px] mt-0.5">
                        <Building2 size={12} /> {app.company}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          (app.atsScore || 0) >= 80
                            ? "bg-teal-soft text-teal-dark"
                            : "bg-amber-soft text-amber-dark"
                        }`}
                      >
                        {app.atsScore || 85}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-ink-soft">
                      {app.appliedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <Pill tone={STATUS_TONES[app.status] || "neutral"}>{app.status}</Pill>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
