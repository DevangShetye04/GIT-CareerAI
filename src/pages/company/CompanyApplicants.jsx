import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Star,
  Award,
  Calendar,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import {
  getApplicants,
  getJobs,
  updateApplicantStatus,
  subscribe,
} from "../../services/companyService.js";
import { APPLICANT_STATUS_TONE } from "../../data/companyMockData.js";

const STATUS_LIST = [
  "All",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

export default function CompanyApplicants() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [applicants, setApplicants] = useState(getApplicants);
  const [jobs, setJobs] = useState(getJobs);

  // Filters state from URL or default
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedJob, setSelectedJob] = useState(searchParams.get("job") || "All");
  const [eligibilityFilter, setEligibilityFilter] = useState(
    searchParams.get("eligibility") || "All"
  );
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All");
  const [sortBy, setSortBy] = useState("ats_desc"); // ats_desc, cgpa_desc, date_desc

  // Action status dropdown popover
  const [openStatusMenuId, setOpenStatusMenuId] = useState(null);

  useEffect(() => {
    function handleDocumentClick(e) {
      if (openStatusMenuId !== null && !e.target.closest(".status-dropdown-container")) {
        setOpenStatusMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [openStatusMenuId]);

  useEffect(() => {
    return subscribe(() => {
      setApplicants(getApplicants());
      setJobs(getJobs());
    });
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (search) params.q = search;
    if (selectedJob !== "All") params.job = selectedJob;
    if (eligibilityFilter !== "All") params.eligibility = eligibilityFilter;
    if (statusFilter !== "All") params.status = statusFilter;
    setSearchParams(params, { replace: true });
  }, [search, selectedJob, eligibilityFilter, statusFilter, setSearchParams]);

  // Unique job role options
  const jobOptions = useMemo(() => {
    const set = new Set(jobs.map((j) => j.title));
    applicants.forEach((a) => set.add(a.role));
    return ["All", ...Array.from(set)];
  }, [jobs, applicants]);

  // Filtered & Sorted candidates
  const filteredApplicants = useMemo(() => {
    let result = applicants.filter((cand) => {
      const matchSearch =
        cand.name.toLowerCase().includes(search.toLowerCase()) ||
        cand.branch.toLowerCase().includes(search.toLowerCase()) ||
        cand.email.toLowerCase().includes(search.toLowerCase()) ||
        cand.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchJob =
        selectedJob === "All" ||
        cand.role === selectedJob ||
        String(cand.jobId) === String(selectedJob);

      const matchEligibility =
        eligibilityFilter === "All" ||
        (eligibilityFilter === "Eligible" && cand.eligible) ||
        (eligibilityFilter === "Not Eligible" && !cand.eligible);

      const matchStatus = statusFilter === "All" || cand.status === statusFilter;

      return matchSearch && matchJob && matchEligibility && matchStatus;
    });

    // Sorting
    if (sortBy === "ats_desc") {
      result.sort((a, b) => b.atsScore - a.atsScore);
    } else if (sortBy === "cgpa_desc") {
      result.sort((a, b) => b.cgpa - a.cgpa);
    } else if (sortBy === "date_desc") {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [applicants, search, selectedJob, eligibilityFilter, statusFilter, sortBy]);

  function handleStatusChange(id, newStatus) {
    updateApplicantStatus(id, newStatus);
    setOpenStatusMenuId(null);
  }

  function clearFilters() {
    setSearch("");
    setSelectedJob("All");
    setEligibilityFilter("All");
    setStatusFilter("All");
    setSortBy("ats_desc");
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Applicants Directory
          </h1>
          <p className="font-body text-sm mt-1 text-ink-soft">
            Screen candidates, inspect AI ATS score matches, and advance students through hiring stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-body text-xs text-ink-soft bg-card border border-line px-3.5 py-2 rounded-xl shadow-xs">
            Showing <strong className="text-ink">{filteredApplicants.length}</strong> of{" "}
            <strong className="text-ink">{applicants.length}</strong> candidates
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by student name, branch, skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 font-body text-sm bg-paper-dim border border-line rounded-xl text-ink placeholder:text-ink-faint focus:bg-card focus:border-teal transition-colors"
            />
          </div>

          {/* Job Filter */}
          <div>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-2 font-body text-sm bg-paper-dim border border-line rounded-xl text-ink focus:bg-card focus:border-teal"
            >
              <option value="All">All Job Openings</option>
              {jobOptions
                .filter((j) => j !== "All")
                .map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
            </select>
          </div>

          {/* Eligibility Filter */}
          <div>
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="w-full px-3 py-2 font-body text-sm bg-paper-dim border border-line rounded-xl text-ink focus:bg-card focus:border-teal"
            >
              <option value="All">All Eligibility</option>
              <option value="Eligible">Eligible Only</option>
              <option value="Not Eligible">Not Eligible Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 font-body text-sm bg-paper-dim border border-line rounded-xl text-ink focus:bg-card focus:border-teal"
            >
              <option value="All">All Statuses</option>
              {STATUS_LIST.filter((s) => s !== "All").map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary sorting and active filter tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-line">
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-ink-faint flex items-center gap-1">
              <ArrowUpDown size={13} /> Sort by:
            </span>
            <button
              type="button"
              onClick={() => setSortBy("ats_desc")}
              className={`font-body text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                sortBy === "ats_desc"
                  ? "bg-teal-soft text-teal-dark border-teal/40 font-medium"
                  : "border-line text-ink-soft hover:bg-paper-dim"
              }`}
            >
              Highest ATS Match
            </button>
            <button
              type="button"
              onClick={() => setSortBy("cgpa_desc")}
              className={`font-body text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                sortBy === "cgpa_desc"
                  ? "bg-teal-soft text-teal-dark border-teal/40 font-medium"
                  : "border-line text-ink-soft hover:bg-paper-dim"
              }`}
            >
              Highest CGPA
            </button>
          </div>

          {(search ||
            selectedJob !== "All" ||
            eligibilityFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-body text-xs text-coral hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Candidates Table */}
      <Card padded={false}>
        {filteredApplicants.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="mx-auto text-ink-faint mb-3 opacity-60" />
            <h3 className="font-display text-base font-semibold text-ink">No candidates found.</h3>
            <p className="font-body text-sm text-ink-soft mt-1">
              No applicants matched the selected filters. Try broadening your search or resetting filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 font-body text-xs text-teal hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[960px]">
              <thead>
                <tr className="text-left font-body text-xs text-ink-faint border-b border-line bg-paper/40">
                  <th className="px-5 py-3.5 font-medium">Candidate</th>
                  <th className="px-5 py-3.5 font-medium">Applied Role</th>
                  <th className="px-5 py-3.5 font-medium text-center">CGPA</th>
                  <th className="px-5 py-3.5 font-medium text-center">ATS Match</th>
                  <th className="px-5 py-3.5 font-medium">Academic Eligibility</th>
                  <th className="px-5 py-3.5 font-medium">Skills Preview</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredApplicants.map((cand) => (
                  <tr key={cand.id} className="hover:bg-paper/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/company/applicants/${cand.id}`}
                        className="font-body font-semibold text-ink hover:text-teal transition-colors block"
                      >
                        {cand.name}
                      </Link>
                      <div className="font-body text-xs text-ink-faint">{cand.branch}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-body text-sm text-ink">{cand.role}</div>
                      <div className="font-body text-[11px] text-ink-faint">
                        Applied {cand.appliedDate}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-center text-sm text-ink-soft font-medium">
                      {cand.cgpa}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                            cand.atsScore >= 85
                              ? "bg-teal-soft text-teal-dark"
                              : cand.atsScore >= 75
                              ? "bg-amber-soft text-amber-dark"
                              : "bg-coral-soft text-coral-dark"
                          }`}
                        >
                          {cand.atsScore}%
                        </span>
                        <div className="w-12 h-1 bg-paper-dim rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              cand.atsScore >= 85
                                ? "bg-teal"
                                : cand.atsScore >= 75
                                ? "bg-amber"
                                : "bg-coral"
                            }`}
                            style={{ width: `${cand.atsScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <Pill tone={cand.eligible ? "teal" : "coral"}>
                        {cand.eligible ? (
                          <>
                            <CheckCircle2 size={12} /> Eligible
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Not Eligible
                          </>
                        )}
                      </Pill>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {cand.skills?.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="font-body text-[11px] px-1.5 py-0.5 rounded bg-paper-dim text-ink-soft"
                          >
                            {s}
                          </span>
                        ))}
                        {cand.skills?.length > 3 && (
                          <span className="font-body text-[10px] text-ink-faint self-center">
                            +{cand.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <Pill tone={APPLICANT_STATUS_TONE[cand.status] || "neutral"}>
                        {cand.status}
                      </Pill>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="relative inline-flex items-center gap-1.5 justify-end">
                        <Link
                          to={`/company/applicants/${cand.id}`}
                          className="font-body text-xs px-2.5 py-1.5 rounded-lg border border-line hover:bg-paper-dim text-ink font-medium transition-colors"
                        >
                          Inspect
                        </Link>

                        {/* Status quick switcher dropdown */}
                        <div className="relative status-dropdown-container">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenStatusMenuId(
                                openStatusMenuId === cand.id ? null : cand.id
                              )
                            }
                            className="p-1.5 rounded-lg border border-line hover:bg-paper-dim text-ink-soft transition-colors"
                            title="Update Candidate Status"
                          >
                            <ChevronDown size={14} />
                          </button>

                          {openStatusMenuId === cand.id && (
                            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-card border border-line shadow-lg py-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-100">
                              <div className="px-3 py-1 font-body text-[11px] font-semibold text-ink-faint uppercase tracking-wider">
                                Stage Actions
                              </div>

                              {cand.status === "Rejected" ? (
                                <div className="px-3 py-2 font-body text-xs text-ink-faint italic">
                                  No further actions (Rejected)
                                </div>
                              ) : (
                                <>
                                  {cand.status === "Applied" && (
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(cand.id, "Under Review")}
                                      className="w-full px-3 py-1.5 font-body text-xs text-ink hover:bg-paper-dim flex items-center gap-2"
                                    >
                                      <Users size={13} className="text-ink-soft" /> Mark Under Review
                                    </button>
                                  )}

                                  {(cand.status === "Applied" || cand.status === "Under Review") && (
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(cand.id, "Shortlisted")}
                                      className="w-full px-3 py-1.5 font-body text-xs text-ink hover:bg-paper-dim flex items-center gap-2"
                                    >
                                      <Star size={13} className="text-amber" /> Shortlist
                                    </button>
                                  )}

                                  {(cand.status === "Shortlisted" || cand.status === "Interview") && (
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(cand.id, "Interview")}
                                      className="w-full px-3 py-1.5 font-body text-xs text-ink hover:bg-paper-dim flex items-center gap-2"
                                    >
                                      <Calendar size={13} className="text-teal" /> {cand.status === "Interview" ? "Reschedule Interview" : "Move to Interview"}
                                    </button>
                                  )}

                                  {(cand.status === "Shortlisted" || cand.status === "Interview") && (
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(cand.id, "Selected")}
                                      className="w-full px-3 py-1.5 font-body text-xs text-ink hover:bg-paper-dim flex items-center gap-2"
                                    >
                                      <Award size={13} className="text-teal-dark" /> Mark Selected
                                    </button>
                                  )}

                                  {cand.status === "Selected" && (
                                    <div className="px-3 py-1 text-xs text-teal-dark font-medium">
                                      Candidate Selected
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(cand.id, "Rejected")}
                                    className="w-full px-3 py-1.5 font-body text-xs text-coral hover:bg-coral-soft flex items-center gap-2 border-t border-line/50 mt-1"
                                  >
                                    <XCircle size={13} /> Reject Candidate
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
