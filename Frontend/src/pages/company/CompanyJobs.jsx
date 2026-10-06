import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Briefcase,
  Users,
  UserCheck,
  XCircle,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import { getJobs, closeJob, deleteJob, subscribe } from "../../services/companyService.js";
import { JOB_STATUS_TONE, formatDisplayDate } from "../../data/companyMockData.js";

function getDaysRemaining(deadlineStr) {
  if (!deadlineStr) return null;
  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) return null;
  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays} days remaining`;
  if (diffDays === 0) return "Closing today";
  return "Expired";
}

export default function CompanyJobs() {
  const [jobs, setJobs] = useState(getJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmModal, setConfirmModal] = useState(null); // { type: 'close' | 'delete', job }

  useEffect(() => {
    return subscribe(() => {
      setJobs(getJobs());
    });
  }, []);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "All" || job.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: jobs.length,
      active: jobs.filter((j) => j.status === "Active").length,
      pending: jobs.filter((j) => j.status === "Pending Approval").length,
      closed: jobs.filter((j) => j.status === "Closed").length,
      draft: jobs.filter((j) => j.status === "Draft").length,
    };
  }, [jobs]);

  function handleCloseJob(job) {
    closeJob(job.id);
    setConfirmModal(null);
  }

  function handleDeleteJob(job) {
    deleteJob(job.id);
    setConfirmModal(null);
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Manage Jobs
          </h1>
          <p className="font-body text-sm mt-1 text-ink-soft">
            Create, track, and manage all campus recruitment listings and application deadlines.
          </p>
        </div>
        <Link to="/company/jobs/create" className="shrink-0">
          <Button variant="primary" className="w-full sm:w-auto justify-center">
            <Plus size={16} /> Post a Job
          </Button>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-paper-dim rounded-xl overflow-x-auto">
            {[
              { label: "All Jobs", value: "All", count: counts.all },
              { label: "Active", value: "Active", count: counts.active },
              { label: "Pending Approval", value: "Pending Approval", count: counts.pending },
              { label: "Closed", value: "Closed", count: counts.closed },
              { label: "Drafts", value: "Draft", count: counts.draft },
            ].map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`font-body text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? "bg-card text-ink shadow-sm border border-line"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.2 rounded-full ${
                      active ? "bg-paper-dim text-ink" : "bg-card/60 text-ink-faint"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 font-body text-sm bg-paper-dim border border-line rounded-xl text-ink placeholder:text-ink-faint focus:bg-card focus:border-teal transition-colors"
            />
          </div>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card padded={false} className="mb-6">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={36} className="mx-auto text-ink-faint mb-3 opacity-60" />
            <h3 className="font-display text-base font-semibold text-ink">No matching jobs found.</h3>
            <p className="font-body text-sm text-ink-soft mt-1 max-w-md mx-auto">
              {search || statusFilter !== "All"
                ? "Try adjusting your search criteria or filter tabs."
                : "You haven't posted any jobs yet. Post your first opening to receive campus applications."}
            </p>
            <div className="mt-4">
              <Link to="/company/jobs/create">
                <Button variant="accent">
                  <Plus size={16} /> Post a Job
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[840px]">
              <thead>
                <tr className="text-left font-body text-xs text-ink-faint border-b border-line bg-paper/40">
                  <th className="px-5 py-3.5 font-medium">Job Title & Details</th>
                  <th className="px-5 py-3.5 font-medium">Location & Mode</th>
                  <th className="px-5 py-3.5 font-medium text-center">Applicants</th>
                  <th className="px-5 py-3.5 font-medium text-center">Eligible</th>
                  <th className="px-5 py-3.5 font-medium">Application Deadline</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredJobs.map((job) => {
                  const daysRemaining =
                    job.status === "Active" ? getDaysRemaining(job.deadline) : null;

                  return (
                    <tr key={job.id} className="hover:bg-paper/30 transition-colors">
                      <td className="px-5 py-4">
                        <Link
                          to={`/company/jobs/${job.id}`}
                          className="font-display font-medium text-ink hover:text-teal transition-colors text-base block"
                        >
                          {job.title}
                        </Link>
                        <div className="font-body text-xs text-ink-soft mt-0.5 flex items-center gap-2">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span className="font-mono">{job.ctc}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-body text-sm text-ink">{job.location}</div>
                        <div className="font-body text-xs text-ink-faint">
                          {job.workMode} · {job.jobType}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <Link
                          to={`/company/applicants?job=${encodeURIComponent(job.title)}`}
                          className="font-mono text-sm font-medium text-ink hover:text-teal underline-offset-2 hover:underline inline-flex items-center gap-1"
                        >
                          <Users size={14} className="text-ink-faint" />
                          {job.applicants}
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="font-mono text-sm font-semibold text-teal-dark inline-flex items-center gap-1">
                          <UserCheck size={14} />
                          {job.eligibleCandidates}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-body text-xs text-ink font-medium">
                          {job.deadlineLabel || formatDisplayDate(job.deadline)}
                        </div>
                        {daysRemaining && (
                          <span
                            className={`font-body text-[11px] font-medium block mt-0.5 ${
                              daysRemaining.includes("Expired") || daysRemaining.includes("today")
                                ? "text-coral"
                                : "text-amber-dark"
                            }`}
                          >
                            {daysRemaining}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <Pill tone={JOB_STATUS_TONE[job.status] || "neutral"}>{job.status}</Pill>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Link
                            to={`/company/jobs/${job.id}`}
                            className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-paper-dim transition-colors"
                            title="View Job Details"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            to={`/company/jobs/${job.id}?edit=true`}
                            className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-paper-dim transition-colors"
                            title="Edit Job"
                          >
                            <Edit size={16} />
                          </Link>

                          {job.status === "Active" && (
                            <button
                              type="button"
                              onClick={() => setConfirmModal({ type: "close", job })}
                              className="p-1.5 rounded-lg text-amber-dark hover:bg-amber-soft transition-colors"
                              title="Close Applications"
                            >
                              <XCircle size={16} />
                            </button>
                          )}

                          {job.status === "Draft" && (
                            <button
                              type="button"
                              onClick={() => setConfirmModal({ type: "delete", job })}
                              className="p-1.5 rounded-lg text-coral hover:bg-coral-soft transition-colors"
                              title="Delete Draft"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display text-lg font-semibold text-ink">
              {confirmModal.type === "close" ? "Close Job Opening?" : "Delete Draft Opening?"}
            </h3>
            <p className="font-body text-sm text-ink-soft mt-2 leading-relaxed">
              {confirmModal.type === "close"
                ? `Are you sure you want to close applications for "${confirmModal.job.title}"? Students will no longer be able to submit new applications.`
                : `Are you sure you want to delete the draft for "${confirmModal.job.title}"? This action cannot be undone.`}
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setConfirmModal(null)}
                className="!py-2 !text-xs"
              >
                Cancel
              </Button>

              {confirmModal.type === "close" ? (
                <Button
                  variant="primary"
                  onClick={() => handleCloseJob(confirmModal.job)}
                  className="!py-2 !text-xs bg-coral text-white hover:bg-coral-dark"
                >
                  Yes, Close Job
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => handleDeleteJob(confirmModal.job)}
                  className="!py-2 !text-xs bg-coral text-white hover:bg-coral-dark"
                >
                  Delete Draft
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
