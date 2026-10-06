import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Star,
  Award,
  Sparkles,
  AlertTriangle,
  FolderGit2,
  X,
  Download,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Pill from "../../components/ui/Pill.jsx";
import {
  getApplicantById,
  updateApplicantStatus,
  subscribe,
} from "../../services/companyService.js";
import { APPLICANT_STATUS_TONE } from "../../data/companyMockData.js";

export default function CandidateDetails() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState(() => getApplicantById(id));
  const [interviewModal, setInterviewModal] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState("2026-09-24T11:00");
  const [interviewMode, setInterviewMode] = useState("Virtual (Google Meet)");
  const [statusFeedback, setStatusFeedback] = useState("");

  useEffect(() => {
    return subscribe(() => {
      setCandidate(getApplicantById(id));
    });
  }, [id]);

  if (!candidate) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <AlertTriangle size={36} className="mx-auto text-amber mb-3" />
        <h2 className="font-display text-xl font-semibold text-ink">Candidate Not Found</h2>
        <p className="font-body text-sm text-ink-soft mt-1">
          No applicant matching ID #{id} was found in the database.
        </p>
        <Link to="/company/applicants" className="mt-4 inline-block">
          <Button variant="primary">
            <ArrowLeft size={15} /> Back to Applicants
          </Button>
        </Link>
      </div>
    );
  }

  function handleAction(newStatus, extra = {}) {
    updateApplicantStatus(candidate.id, newStatus, extra);
    setStatusFeedback(`Candidate marked as "${newStatus}" successfully.`);
    setTimeout(() => setStatusFeedback(""), 3000);
  }

  function handleScheduleInterview(e) {
    e.preventDefault();
    const formattedLabel = new Date(interviewDate).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    handleAction("Interview", {
      interviewDate,
      interviewDateLabel: formattedLabel,
      interviewMode,
    });
    setInterviewModal(false);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Candidate Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link
            to="/company/applicants"
            className="inline-flex items-center gap-1.5 font-body text-xs text-ink-soft hover:text-ink transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Back to Applicants Directory
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              {candidate.name}
            </h1>
            <Pill tone={APPLICANT_STATUS_TONE[candidate.status] || "neutral"}>
              {candidate.status}
            </Pill>
          </div>

          <p className="font-body text-sm text-ink-soft mt-1 flex flex-wrap items-center gap-2">
            <span>Applied for <strong className="text-ink">{candidate.role}</strong></span>
            <span>•</span>
            <span>Applied on {candidate.appliedDate}</span>
          </p>
        </div>

        {/* Action bar for Recruiter */}
        <div className="flex flex-wrap items-center gap-2">
          {candidate.status === "Rejected" ? (
            <div className="px-3 py-1.5 rounded-lg bg-coral-soft/50 text-coral-dark text-xs font-medium border border-coral/30 flex items-center gap-1.5">
              <XCircle size={14} /> Application Status: Rejected
            </div>
          ) : (
            <>
              {candidate.status !== "Shortlisted" && candidate.status !== "Selected" && candidate.status !== "Interview" && (
                <Button
                  variant="ghost"
                  onClick={() => handleAction("Shortlisted")}
                  className="!py-2 !text-xs border-amber/30 text-amber-dark hover:bg-amber-soft"
                >
                  <Star size={14} /> Shortlist
                </Button>
              )}

              {candidate.status !== "Selected" && (
                <Button
                  variant="ghost"
                  onClick={() => setInterviewModal(true)}
                  className="!py-2 !text-xs border-teal/30 text-teal hover:bg-teal-soft"
                >
                  <Calendar size={14} /> {candidate.status === "Interview" ? "Reschedule Interview" : "Schedule Interview"}
                </Button>
              )}

              {candidate.status !== "Selected" && (
                <Button
                  variant="primary"
                  onClick={() => handleAction("Selected")}
                  className="!py-2 !text-xs"
                >
                  <Award size={14} /> Select Candidate
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => setRejectModalOpen(true)}
                className="!py-2 !text-xs text-coral hover:bg-coral-soft border-coral/30"
              >
                <XCircle size={14} /> Reject Candidate
              </Button>
            </>
          )}
        </div>
      </div>

      {statusFeedback && (
        <div className="p-3 bg-teal-soft border border-teal/20 text-teal-dark font-body text-xs rounded-xl animate-in fade-in">
          {statusFeedback}
        </div>
      )}

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): ATS & Criteria Evaluation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility Breakdown Card */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  Academic Eligibility Check
                </h3>
                <p className="font-body text-xs text-ink-faint">
                  Verification against your posted job placement requirements.
                </p>
              </div>

              <Pill tone={candidate.eligible ? "teal" : "coral"}>
                {candidate.eligible ? (
                  <>
                    <CheckCircle2 size={13} /> Academically Eligible
                  </>
                ) : (
                  <>
                    <XCircle size={13} /> Not Eligible
                  </>
                )}
              </Pill>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-paper-dim/60 border border-line">
                <span className="font-body text-xs text-ink-faint block mb-1">
                  Cumulative GPA:
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-semibold text-ink">
                    {candidate.cgpa} / 10.0
                  </span>
                  {candidate.cgpa >= 7.0 ? (
                    <span className="font-body text-xs text-teal font-medium flex items-center gap-1">
                      <CheckCircle2 size={13} /> Meets Cutoff (≥ 7.0)
                    </span>
                  ) : (
                    <span className="font-body text-xs text-coral font-medium flex items-center gap-1">
                      <XCircle size={13} /> Below Cutoff (&lt; 7.0)
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-paper-dim/60 border border-line">
                <span className="font-body text-xs text-ink-faint block mb-1">
                  Engineering Branch:
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm font-semibold text-ink truncate">
                    {candidate.branch}
                  </span>
                  <span className="font-body text-xs text-teal font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} /> Approved
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-paper-dim/60 border border-line">
                <span className="font-body text-xs text-ink-faint block mb-1">
                  Active Backlogs:
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-semibold text-ink">
                    {candidate.backlogs || 0}
                  </span>
                  <span className="font-body text-xs text-teal font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} /> Within Limit
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-paper-dim/60 border border-line">
                <span className="font-body text-xs text-ink-faint block mb-1">
                  Passing Batch:
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-semibold text-ink">
                    {candidate.gradYear}
                  </span>
                  <span className="font-body text-xs text-teal font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} /> 2026 Batch
                  </span>
                </div>
              </div>
            </div>

            {!candidate.eligible && candidate.ineligibilityReason && (
              <div className="mt-4 p-3 rounded-xl bg-coral-soft border border-coral/20">
                <p className="font-body text-xs text-coral-dark leading-relaxed font-medium">
                  <strong>Ineligibility Note:</strong> {candidate.ineligibilityReason}
                </p>
              </div>
            )}
          </Card>

          {/* ATS Compatibility & Skill Match Card */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                  <Sparkles size={17} className="text-amber" /> ATS Resume Match Analysis
                </h3>
                <p className="font-body text-xs text-ink-faint">
                  Semantic alignment between candidate resume keywords and your job description.
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-2xl font-bold text-teal-dark">
                  {candidate.atsScore}%
                </span>
                <span className="font-body text-[11px] text-ink-faint block">Match score</span>
              </div>
            </div>

            {/* Visual match progress bar */}
            <div className="mb-6">
              <div className="h-3 rounded-full bg-paper-dim overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    candidate.atsScore >= 85
                      ? "bg-teal"
                      : candidate.atsScore >= 75
                      ? "bg-amber"
                      : "bg-coral"
                  }`}
                  style={{ width: `${candidate.atsScore}%` }}
                />
              </div>
              <div className="flex justify-between font-body text-[11px] text-ink-faint mt-1">
                <span>0%</span>
                <span>Low Match (&lt;70%)</span>
                <span>Good Match (70-84%)</span>
                <span>High Match (≥85%)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Matched vs Missing Skills */}
            <div className="space-y-4">
              <div>
                <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-teal-dark mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-teal" /> Matched Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.matchedSkills?.length > 0 ? (
                    candidate.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="font-body text-xs font-medium px-2.5 py-1 rounded-lg bg-teal-soft text-teal-dark border border-teal/20"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="font-body text-xs text-ink-faint">No direct skills matched.</span>
                  )}
                </div>
              </div>

              {candidate.missingSkills?.length > 0 && (
                <div>
                  <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-coral-dark mb-2 flex items-center gap-1.5">
                    <XCircle size={13} className="text-coral" /> Missing Skills from Job Spec
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="font-body text-xs font-medium px-2.5 py-1 rounded-lg bg-coral-soft text-coral-dark border border-coral/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {candidate.relevantSkills?.length > 0 && (
                <div>
                  <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-ink-faint mb-2">
                    Additional Relevant Skills Found on Resume
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.relevantSkills.map((s) => (
                      <span
                        key={s}
                        className="font-body text-xs font-medium px-2.5 py-1 rounded-lg bg-paper-dim text-ink-soft"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Academic Projects Card */}
          <Card>
            <h3 className="font-display text-lg font-semibold text-ink mb-4 flex items-center gap-2">
              <FolderGit2 size={18} className="text-teal" /> Projects & Practical Experience
            </h3>

            {candidate.projects && candidate.projects.length > 0 ? (
              <div className="space-y-4">
                {candidate.projects.map((proj, i) => (
                  <div key={i} className="p-4 rounded-xl border border-line bg-paper/30">
                    <div className="flex items-center justify-between">
                      <h4 className="font-body font-semibold text-sm text-ink">{proj.name}</h4>
                      {proj.tech && <Pill tone="neutral">{proj.tech}</Pill>}
                    </div>
                    <p className="font-body text-xs text-ink-soft mt-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-ink-faint">No project history listed.</p>
            )}
          </Card>
        </div>

        {/* Right Column (1 Col): Personal, Education & Resume Preview */}
        <div className="space-y-6">
          {/* Candidate Profile Summary */}
          <Card>
            <h3 className="font-display text-base font-semibold text-ink mb-4">
              Candidate Profile
            </h3>

            <div className="space-y-3 font-body text-sm">
              <div>
                <span className="text-ink-faint text-xs block">College / Institute:</span>
                <span className="font-medium text-ink">{candidate.college}</span>
              </div>

              <div>
                <span className="text-ink-faint text-xs block">Branch of Study:</span>
                <span className="font-medium text-ink">{candidate.branch}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Mail size={14} className="text-ink-faint shrink-0" />
                <a
                  href={`mailto:${candidate.email}`}
                  className="text-xs text-teal hover:underline truncate"
                >
                  {candidate.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={14} className="text-ink-faint shrink-0" />
                <span className="text-xs text-ink-soft font-mono">{candidate.phone}</span>
              </div>
            </div>
          </Card>

          {/* Education Records */}
          <Card>
            <h3 className="font-display text-base font-semibold text-ink mb-3 flex items-center gap-2">
              <GraduationCap size={16} className="text-teal" /> Education History
            </h3>

            <div className="space-y-3 font-body text-xs">
              <div className="pb-2 border-b border-line">
                <div className="font-semibold text-ink">{candidate.education?.degree}</div>
                <div className="text-ink-faint">{candidate.education?.college}</div>
                <div className="font-mono text-teal-dark font-medium mt-0.5">
                  CGPA: {candidate.education?.cgpa} ({candidate.education?.duration})
                </div>
              </div>

              <div className="flex justify-between pb-1 text-ink-soft">
                <span>Higher Secondary (12th):</span>
                <span className="font-mono font-medium text-ink">
                  {candidate.education?.twelfth || "85.0%"}
                </span>
              </div>

              <div className="flex justify-between text-ink-soft">
                <span>Secondary School (10th):</span>
                <span className="font-mono font-medium text-ink">
                  {candidate.education?.tenth || "88.0%"}
                </span>
              </div>
            </div>
          </Card>

          {/* Interview Details (if scheduled) */}
          {candidate.interviewDateLabel && (
            <Card className="border-teal/30 bg-teal-soft/20">
              <h3 className="font-display text-sm font-semibold text-teal-dark mb-2 flex items-center gap-1.5">
                <Calendar size={15} /> Scheduled Interview
              </h3>
              <div className="font-body text-xs space-y-1.5 text-ink">
                <div>
                  <strong>Time:</strong> {candidate.interviewDateLabel}
                </div>
                <div>
                  <strong>Mode:</strong> {candidate.interviewMode}
                </div>
                {candidate.interviewLocation && (
                  <div>
                    <strong>Link/Location:</strong>{" "}
                    <span className="text-teal underline font-mono">
                      {candidate.interviewLocation}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Resume PDF Action Mock */}
          <Card>
            <h3 className="font-display text-base font-semibold text-ink mb-2">Resume File</h3>
            <div className="p-3 rounded-xl border border-line bg-paper-dim/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText size={22} className="text-coral shrink-0" />
                <div className="min-w-0">
                  <div className="font-body text-xs font-semibold text-ink truncate">
                    {candidate.name.replace(/\s+/g, "_")}_Resume.pdf
                  </div>
                  <div className="font-body text-[10px] text-ink-faint">PDF · 340 KB</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResumeModalOpen(true)}
                className="font-body text-xs px-2.5 py-1.5 rounded-lg border border-line bg-card hover:bg-paper-dim text-ink font-medium shrink-0 transition-colors"
              >
                View Resume
              </button>
            </div>
          </Card>

          {/* Recruiter Notes */}
          {candidate.notes && (
            <Card>
              <h3 className="font-display text-base font-semibold text-ink mb-2">
                Recruiter Screening Notes
              </h3>
              <p className="font-body text-xs text-ink-soft italic leading-relaxed">
                &quot;{candidate.notes}&quot;
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {interviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="font-display text-lg font-semibold text-ink">Schedule Interview</h3>
            <p className="font-body text-xs text-ink-soft mt-1">
              Arrange an interview round with {candidate.name} for {candidate.role}.
            </p>

            <form onSubmit={handleScheduleInterview} className="space-y-4 mt-5">
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
                  onClick={() => setInterviewModal(false)}
                  className="!py-2 !text-xs"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="!py-2 !text-xs">
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resume Preview Modal */}
      {resumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-card border border-line rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-coral-soft text-coral flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {candidate.name} — Resume Preview
                  </h3>
                  <p className="font-body text-xs text-ink-faint">
                    Candidate for {candidate.role} · ATS Score: {candidate.atsScore}%
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResumeModalOpen(false)}
                className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-paper-dim transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Resume Mock Sheet */}
            <div className="overflow-y-auto flex-1 py-5 space-y-5 pr-1 font-body">
              {/* Header Info */}
              <div className="p-4 rounded-xl bg-paper/50 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-display text-xl font-bold text-ink">{candidate.name}</h4>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {candidate.education?.degree} · {candidate.college}
                  </p>
                </div>
                <div className="text-xs text-ink-soft space-y-0.5">
                  <div>Email: <span className="font-mono text-ink">{candidate.email}</span></div>
                  <div>Phone: <span className="font-mono text-ink">{candidate.phone}</span></div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h5 className="font-display text-xs font-semibold uppercase tracking-wider text-ink-faint mb-2">
                  Academic Record
                </h5>
                <div className="p-3.5 rounded-xl border border-line bg-card space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium text-ink">
                    <span>{candidate.education?.degree}</span>
                    <span className="font-mono text-teal-dark font-semibold">CGPA: {candidate.education?.cgpa}</span>
                  </div>
                  <div className="text-ink-faint">{candidate.education?.college} ({candidate.education?.duration})</div>
                  <div className="flex gap-4 pt-1 text-ink-soft text-[11px]">
                    <span>12th / Diploma: <strong>{candidate.education?.twelfth}</strong></span>
                    <span>10th / Secondary: <strong>{candidate.education?.tenth}</strong></span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h5 className="font-display text-xs font-semibold uppercase tracking-wider text-ink-faint mb-2">
                  Skills & Competencies
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills?.map((skill) => {
                    const isMatched = candidate.matchedSkills?.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                          isMatched
                            ? "bg-teal-soft text-teal-dark border border-teal/20"
                            : "bg-paper-dim text-ink-soft"
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h5 className="font-display text-xs font-semibold uppercase tracking-wider text-ink-faint mb-2">
                  Key Projects
                </h5>
                <div className="space-y-3">
                  {candidate.projects?.map((proj, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-line bg-card text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-ink">{proj.name}</span>
                        {proj.tech && <span className="text-[11px] px-2 py-0.5 rounded bg-paper-dim text-ink-soft font-mono">{proj.tech}</span>}
                      </div>
                      <p className="text-ink-soft mt-1.5 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
              <span className="text-xs text-ink-faint">Verified Student Resume · GIT CareerAI</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setResumeModalOpen(false)}
                  className="!py-2 !text-xs"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const blob = new Blob(
                      [
                        `GIT CareerAI — Student Resume\nCandidate: ${candidate.name}\nRole: ${candidate.role}\nCGPA: ${candidate.cgpa}\nDegree: ${candidate.education?.degree}\nCollege: ${candidate.college}\nSkills: ${candidate.skills?.join(", ")}\n`
                      ],
                      { type: "text/plain" }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${candidate.name.replace(/\\s+/g, "_")}_Resume.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="!py-2 !text-xs"
                >
                  <Download size={14} /> Download Summary
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Rejection Confirmation Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-coral mb-2">
              <AlertTriangle size={20} />
              <h3 className="font-display text-lg font-semibold text-ink">
                Confirm Candidate Rejection
              </h3>
            </div>
            <p className="font-body text-xs text-ink-soft mt-1 leading-relaxed">
              Are you sure you want to reject <strong className="text-ink">{candidate.name}</strong>{" "}
              for the role of <strong className="text-ink">{candidate.role}</strong>? Their
              application status will be marked as Rejected.
            </p>
            <div className="flex items-center justify-end gap-3 pt-5">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="!py-2 !text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={() => {
                  handleAction("Rejected");
                  setRejectModalOpen(false);
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
