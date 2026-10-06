import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  Star,
  Calendar,
  Award,
  XCircle,
  Eye,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Pill from "../../components/ui/Pill.jsx";
import {
  getApplicants,
  updateApplicantStatus,
  subscribe,
} from "../../services/companyService.js";
import { APPLICANT_STATUS_TONE } from "../../data/companyMockData.js";

export default function ShortlistedCandidates() {
  const [allApplicants, setAllApplicants] = useState(getApplicants);
  const [filterStage, setFilterStage] = useState("All"); // All, Shortlisted, Interview, Selected
  const [scheduleModalCand, setScheduleModalCand] = useState(null);
  const [rejectModalCand, setRejectModalCand] = useState(null);
  const [interviewDate, setInterviewDate] = useState("2026-09-24T11:00");
  const [interviewMode, setInterviewMode] = useState("Virtual (Google Meet)");

  useEffect(() => {
    return subscribe(() => {
      setAllApplicants(getApplicants());
    });
  }, []);

  // Filter only shortlisted / interview / selected students
  const pipelineCandidates = useMemo(() => {
    return allApplicants.filter((a) =>
      ["Shortlisted", "Interview", "Selected"].includes(a.status)
    );
  }, [allApplicants]);

  const filteredCandidates = useMemo(() => {
    if (filterStage === "All") return pipelineCandidates;
    return pipelineCandidates.filter((c) => c.status === filterStage);
  }, [pipelineCandidates, filterStage]);

  const counts = useMemo(() => {
    return {
      all: pipelineCandidates.length,
      shortlisted: pipelineCandidates.filter((c) => c.status === "Shortlisted").length,
      interview: pipelineCandidates.filter((c) => c.status === "Interview").length,
      selected: pipelineCandidates.filter((c) => c.status === "Selected").length,
    };
  }, [pipelineCandidates]);

  function handleAction(id, newStatus, extra = {}) {
    updateApplicantStatus(id, newStatus, extra);
    setScheduleModalCand(null);
  }

  function handleConfirmInterview(e) {
    e.preventDefault();
    if (!scheduleModalCand) return;
    const formatted = new Date(interviewDate).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    handleAction(scheduleModalCand.id, "Interview", {
      interviewDate,
      interviewDateLabel: formatted,
      interviewMode,
    });
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Shortlisted Candidates & Interview Pipeline
          </h1>
          <p className="font-body text-sm mt-1 text-ink-soft">
            Manage your qualified candidates through technical evaluations, interview rounds, and final selections.
          </p>
        </div>

        <Link to="/company/applicants">
          <Button variant="ghost" className="!py-2 !text-xs">
            Browse All Applicants
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-xs text-ink-faint">Qualified Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-teal-soft text-teal-dark flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <div className="font-display text-2xl font-semibold text-ink">{counts.all}</div>
          <div className="font-body text-xs text-teal mt-1">All pipeline stages</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-xs text-ink-faint">Shortlisted Pool</span>
            <div className="w-8 h-8 rounded-lg bg-amber-soft text-amber-dark flex items-center justify-center">
              <Star size={16} />
            </div>
          </div>
          <div className="font-display text-2xl font-semibold text-ink">{counts.shortlisted}</div>
          <div className="font-body text-xs text-amber-dark mt-1">Ready for interview call</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-xs text-ink-faint">In Interview Stage</span>
            <div className="w-8 h-8 rounded-lg bg-teal-soft text-teal-dark flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="font-display text-2xl font-semibold text-teal-dark">{counts.interview}</div>
          <div className="font-body text-xs text-teal mt-1">Interviews in progress</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-xs text-ink-faint">Selected / Offers</span>
            <div className="w-8 h-8 rounded-lg bg-teal-soft text-teal-dark flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="font-display text-2xl font-semibold text-ink">{counts.selected}</div>
          <div className="font-body text-xs text-ink-soft mt-1">Offers extended</div>
        </Card>
      </div>

      {/* Stage Tabs */}
      <div className="flex items-center gap-2 p-1 bg-paper-dim rounded-xl w-fit">
        {[
          { label: "All Qualified", value: "All", count: counts.all },
          { label: "Shortlisted", value: "Shortlisted", count: counts.shortlisted },
          { label: "Interview Scheduled", value: "Interview", count: counts.interview },
          { label: "Selected", value: "Selected", count: counts.selected },
        ].map((tab) => {
          const active = filterStage === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilterStage(tab.value)}
              className={`font-body text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
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

      {/* Shortlisted Candidates Table */}
      <Card padded={false}>
        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck size={36} className="mx-auto text-ink-faint mb-3 opacity-60" />
            <h3 className="font-display text-base font-semibold text-ink">
              No candidates found.
            </h3>
            <p className="font-body text-sm text-ink-soft mt-1 max-w-md mx-auto">
              {filterStage === "All"
                ? "You haven't shortlisted any candidates yet. Review your applicants and click 'Shortlist' to add them to this pipeline."
                : `There are currently no candidates marked as "${filterStage}".`}
            </p>
            <div className="mt-4">
              <Link to="/company/applicants">
                <Button variant="primary">
                  Review Applicants Directory <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left font-body text-xs text-ink-faint border-b border-line bg-paper/40">
                  <th className="px-5 py-3.5 font-medium">Candidate</th>
                  <th className="px-5 py-3.5 font-medium">Job Opening</th>
                  <th className="px-5 py-3.5 font-medium text-center">CGPA</th>
                  <th className="px-5 py-3.5 font-medium text-center">ATS Score</th>
                  <th className="px-5 py-3.5 font-medium">Core Skills</th>
                  <th className="px-5 py-3.5 font-medium">Interview / Schedule</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredCandidates.map((cand) => (
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
                        Shortlisted {cand.shortlistedDate || cand.appliedDate}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-center text-xs text-ink-soft">
                      {cand.cgpa}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-teal-soft text-teal-dark">
                        {cand.atsScore}%
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {cand.skills?.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="font-body text-[11px] px-1.5 py-0.5 rounded bg-paper-dim text-ink-soft"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      {cand.interviewDateLabel ? (
                        <div>
                          <div className="font-body text-xs font-medium text-teal-dark flex items-center gap-1">
                            <Calendar size={12} /> {cand.interviewDateLabel}
                          </div>
                          <div className="font-body text-[11px] text-ink-faint">
                            {cand.interviewMode}
                          </div>
                        </div>
                      ) : (
                        <span className="font-body text-xs text-ink-faint italic">
                          Not scheduled yet
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <Pill tone={APPLICANT_STATUS_TONE[cand.status] || "neutral"}>
                        {cand.status}
                      </Pill>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <Link
                          to={`/company/applicants/${cand.id}`}
                          className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-paper-dim"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setScheduleModalCand(cand);
                            if (cand.interviewDate) setInterviewDate(cand.interviewDate);
                          }}
                          className="font-body text-xs px-2.5 py-1.5 rounded-lg border border-teal/30 bg-teal-soft/40 text-teal-dark font-medium hover:bg-teal-soft"
                          title="Schedule / Reschedule Interview"
                        >
                          Interview
                        </button>

                        {cand.status !== "Selected" && (
                          <button
                            type="button"
                            onClick={() => handleAction(cand.id, "Selected")}
                            className="p-1.5 rounded-lg text-teal hover:bg-teal-soft"
                            title="Mark Selected / Offer"
                          >
                            <Award size={16} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setRejectModalCand(cand)}
                          className="p-1.5 rounded-lg text-coral hover:bg-coral-soft"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Schedule Interview Modal */}
      {scheduleModalCand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="font-display text-lg font-semibold text-ink">Schedule Interview</h3>
            <p className="font-body text-xs text-ink-soft mt-1">
              Candidate: <strong className="text-ink">{scheduleModalCand.name}</strong> (
              {scheduleModalCand.role})
            </p>

            <form onSubmit={handleConfirmInterview} className="space-y-4 mt-5">
              <div>
                <label className="block font-body text-xs font-medium text-ink-soft mb-1">
                  Interview Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full font-body text-sm px-3.5 py-2 bg-paper-dim border border-line rounded-xl text-ink"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-ink-soft mb-1">
                  Mode / Location
                </label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                  className="w-full font-body text-sm px-3.5 py-2 bg-paper-dim border border-line rounded-xl text-ink"
                >
                  <option value="Virtual (Google Meet)">Virtual (Google Meet)</option>
                  <option value="Virtual (Microsoft Teams)">Virtual (Microsoft Teams)</option>
                  <option value="On-campus Room 204 (GIT)">On-campus Room 204 (GIT)</option>
                  <option value="TCS Campus Office">TCS Campus Office</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setScheduleModalCand(null)}
                  className="!py-2 !text-xs"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="!py-2 !text-xs">
                  Save Interview Call
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Rejection Confirmation Modal */}
      {rejectModalCand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-coral mb-2">
              <AlertTriangle size={20} />
              <h3 className="font-display text-lg font-semibold text-ink">
                Confirm Candidate Rejection
              </h3>
            </div>
            <p className="font-body text-xs text-ink-soft mt-1 leading-relaxed">
              Are you sure you want to reject{" "}
              <strong className="text-ink">{rejectModalCand.name}</strong> for the role of{" "}
              <strong className="text-ink">{rejectModalCand.role}</strong>? This candidate will be
              removed from the shortlisted recruitment pipeline.
            </p>
            <div className="flex items-center justify-end gap-3 pt-5">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setRejectModalCand(null)}
                className="!py-2 !text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={() => {
                  handleAction(rejectModalCand.id, "Rejected");
                  setRejectModalCand(null);
                }}
                className="!py-2 !text-xs !bg-coral hover:!bg-coral-dark text-white border-coral"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
