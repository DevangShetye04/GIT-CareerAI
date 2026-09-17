import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  XCircle,
  Edit,
  Save,
  X,
  Share2,
  AlertTriangle,
  Check,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Pill from "../../components/ui/Pill.jsx";
import FormField from "../../components/ui/FormField.jsx";
import {
  getJobById,
  updateJob,
  closeJob,
  getApplicants,
  subscribe,
} from "../../services/companyService.js";
import {
  JOB_STATUS_TONE,
  APPLICANT_STATUS_TONE,
  formatDisplayDate,
} from "../../data/companyMockData.js";

export default function CompanyJobDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const [job, setJob] = useState(() => getJobById(id));
  const [applicants, setApplicants] = useState(() => getApplicants({ jobId: id }));
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  useEffect(() => {
    return subscribe(() => {
      const updated = getJobById(id);
      setJob(updated);
      setApplicants(getApplicants({ jobId: id }));
    });
  }, [id]);

  useEffect(() => {
    if (job) {
      setEditForm({
        title: job.title || "",
        department: job.department || "",
        location: job.location || "",
        workMode: job.workMode || "Hybrid",
        jobType: job.jobType || "Full-Time",
        ctc: job.ctc || "",
        vacancies: String(job.vacancies || 1),
        deadline: job.deadline || "",
        minCgpa: String(job.minCgpa || 6.5),
        allowedBacklogs: String(job.allowedBacklogs || 0),
        graduationYear: String(job.graduationYear || "2026"),
        selectionProcess: job.selectionProcess || "",
        description: job.description || "",
        status: job.status || "Active",
        joiningDate: job.joiningDate || "",
      });
    }
  }, [job]);

  if (!job) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <AlertTriangle size={36} className="mx-auto text-amber mb-3" />
        <h2 className="font-display text-xl font-semibold text-ink">Job Not Found</h2>
        <p className="font-body text-sm text-ink-soft mt-1">
          The requested opening ID #{id} does not exist or has been removed.
        </p>
        <Link to="/company/jobs" className="mt-4 inline-block">
          <Button variant="primary">
            <ArrowLeft size={15} /> Back to All Jobs
          </Button>
        </Link>
      </div>
    );
  }

  function toggleEdit(enable) {
    if (enable) {
      setSearchParams({ edit: "true" });
    } else {
      setSearchParams({});
    }
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    setSaving(true);
    updateJob(job.id, {
      ...editForm,
      vacancies: Number(editForm.vacancies) || 1,
      minCgpa: Number(editForm.minCgpa) || 6.0,
      allowedBacklogs: Number(editForm.allowedBacklogs) || 0,
      deadlineLabel: formatDisplayDate(editForm.deadline),
    });
    setSaving(false);
    toggleEdit(false);
    setUpdateMsg("Job details successfully saved.");
    setTimeout(() => setUpdateMsg(""), 3000);
  }

  function handleCloseJob() {
    closeJob(job.id);
    setConfirmCloseOpen(false);
    setUpdateMsg("Applications closed for this opening.");
    setTimeout(() => setUpdateMsg(""), 3000);
  }

  function copyShareLink() {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 pb-12">
      {updateMsg && (
        <div className="p-3 bg-teal-soft border border-teal/20 text-teal-dark font-body text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check size={14} /> {updateMsg}
        </div>
      )}

      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/company/jobs"
            className="inline-flex items-center gap-1.5 font-body text-xs text-ink-soft hover:text-ink transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Back to Job Listings
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              {job.title}
            </h1>
            <Pill tone={JOB_STATUS_TONE[job.status] || "neutral"}>{job.status}</Pill>
          </div>
          <p className="font-body text-xs text-ink-faint mt-1">
            Opening #{job.id} · {job.department} · {job.location} ({job.workMode})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={copyShareLink}
            className="font-body text-xs px-3 py-2 rounded-xl border border-line hover:bg-paper-dim text-ink-soft flex items-center gap-1.5 transition-colors"
          >
            <Share2 size={13} /> {copied ? "Copied Link!" : "Share Link"}
          </button>

          {!isEditMode ? (
            <>
              <Button
                variant="ghost"
                onClick={() => toggleEdit(true)}
                className="!py-2 !text-xs"
              >
                <Edit size={14} /> Edit Job
              </Button>

              {job.status === "Active" && (
                <Button
                  variant="ghost"
                  onClick={() => setConfirmCloseOpen(true)}
                  className="!py-2 !text-xs text-coral hover:bg-coral-soft"
                >
                  <XCircle size={14} /> Close Job
                </Button>
              )}

              <Link to={`/company/applicants?job=${encodeURIComponent(job.title)}`}>
                <Button variant="primary" className="!py-2 !text-xs">
                  <Users size={14} /> Manage Applicants
                </Button>
              </Link>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => toggleEdit(false)}
              className="!py-2 !text-xs"
            >
              <X size={14} /> Cancel Editing
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Row for this Job */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="font-body text-xs text-ink-faint mb-1">Total Applicants</div>
          <div className="font-display text-2xl font-semibold text-ink">{job.applicants}</div>
          <div className="font-body text-xs text-ink-soft mt-1">Students applied</div>
        </Card>

        <Card>
          <div className="font-body text-xs text-ink-faint mb-1">Eligible Candidates</div>
          <div className="font-display text-2xl font-semibold text-teal-dark">
            {job.eligibleCandidates}
          </div>
          <div className="font-body text-xs text-teal mt-1">Pass academic criteria</div>
        </Card>

        <Card>
          <div className="font-body text-xs text-ink-faint mb-1">Shortlisted</div>
          <div className="font-display text-2xl font-semibold text-amber-dark">
            {job.shortlistedCandidates || 0}
          </div>
          <div className="font-body text-xs text-amber mt-1">Advanced to interview</div>
        </Card>

        <Card>
          <div className="font-body text-xs text-ink-faint mb-1">Total Openings</div>
          <div className="font-display text-2xl font-semibold text-ink">{job.vacancies}</div>
          <div className="font-body text-xs text-ink-soft mt-1">Available seats</div>
        </Card>
      </div>

      {/* Edit Form Mode vs View Mode */}
      {isEditMode && editForm ? (
        <Card>
          <form onSubmit={handleSaveEdit} className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display text-lg font-semibold text-ink">Edit Opening Details</h3>
              <Pill tone="amber">Editing Mode</Pill>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="editTitle"
                label="Job Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />

              <FormField
                id="editDept"
                label="Department"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              />

              <FormField
                id="editLocation"
                label="Location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />

              <FormField
                id="editCtc"
                label="Package / CTC"
                value={editForm.ctc}
                onChange={(e) => setEditForm({ ...editForm, ctc: e.target.value })}
              />

              <FormField
                id="editStatus"
                label="Job Status"
                as="select"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
              </FormField>

              <FormField
                id="editDeadline"
                label="Application Deadline"
                type="date"
                value={editForm.deadline}
                onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
              />

              <FormField
                id="editMinCgpa"
                label="Minimum CGPA"
                type="number"
                step="0.1"
                value={editForm.minCgpa}
                onChange={(e) => setEditForm({ ...editForm, minCgpa: e.target.value })}
              />

              <FormField
                id="editVacancies"
                label="Number of Vacancies"
                type="number"
                value={editForm.vacancies}
                onChange={(e) => setEditForm({ ...editForm, vacancies: e.target.value })}
              />

              <FormField
                id="editJoiningDate"
                label="Joining Date"
                type="date"
                value={editForm.joiningDate}
                onChange={(e) => setEditForm({ ...editForm, joiningDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-ink-soft mb-1.5">
                Job Description
              </label>
              <textarea
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full font-body text-sm text-ink bg-card border border-line rounded-xl p-3 focus:border-teal"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => toggleEdit(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={saving}>
                <Save size={15} /> Save Changes
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="font-display text-lg font-semibold text-ink mb-3">Job Description</h3>
              <p className="font-body text-sm text-ink leading-relaxed whitespace-pre-line">
                {job.description}
              </p>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="mt-5">
                  <h4 className="font-display text-sm font-semibold text-ink mb-2">
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside font-body text-sm text-ink-soft">
                    {job.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="font-display text-lg font-semibold text-ink mb-3">
                Skill Specifications
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-ink-faint mb-2">
                    Required Core Skills (ATS Matched)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.map((s) => (
                      <Pill key={s} tone="teal">
                        {s}
                      </Pill>
                    ))}
                  </div>
                </div>

                {job.preferredSkills && job.preferredSkills.length > 0 && (
                  <div>
                    <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-ink-faint mb-2">
                      Preferred / Bonus Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.preferredSkills.map((s) => (
                        <Pill key={s} tone="amber">
                          {s}
                        </Pill>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Applicants for this specific Job */}
            <Card padded={false}>
              <div className="p-5 pb-3 flex items-center justify-between border-b border-line">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    Applicants for this Role ({applicants.length})
                  </h3>
                  <p className="font-body text-xs text-ink-faint">
                    Candidates who submitted applications for {job.title}.
                  </p>
                </div>
                <Link
                  to={`/company/applicants?job=${encodeURIComponent(job.title)}`}
                  className="font-body text-xs text-teal font-medium hover:underline"
                >
                  Manage All →
                </Link>
              </div>

              {applicants.length === 0 ? (
                <div className="p-8 text-center text-ink-faint font-body text-sm">
                  No applicants have applied to this opening yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left font-body text-xs text-ink-faint bg-paper/30">
                        <th className="px-5 py-3 font-medium">Candidate</th>
                        <th className="px-5 py-3 font-medium text-center">CGPA</th>
                        <th className="px-5 py-3 font-medium text-center">ATS Match</th>
                        <th className="px-5 py-3 font-medium">Eligibility</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {applicants.map((cand) => (
                        <tr key={cand.id} className="hover:bg-paper/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className="font-body font-medium text-ink">{cand.name}</div>
                            <div className="font-body text-xs text-ink-faint">{cand.branch}</div>
                          </td>
                          <td className="px-5 py-3 font-mono text-center text-xs text-ink-soft">
                            {cand.cgpa}
                          </td>
                          <td className="px-5 py-3 font-mono text-center text-xs font-semibold text-teal-dark">
                            {cand.atsScore}%
                          </td>
                          <td className="px-5 py-3">
                            <Pill tone={cand.eligible ? "teal" : "coral"}>
                              {cand.eligible ? "Eligible" : "Not Eligible"}
                            </Pill>
                          </td>
                          <td className="px-5 py-3">
                            <Pill tone={APPLICANT_STATUS_TONE[cand.status] || "neutral"}>
                              {cand.status}
                            </Pill>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              to={`/company/applicants/${cand.id}`}
                              className="font-body text-xs text-teal font-medium hover:underline"
                            >
                              Inspect →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Info (1 Col) */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-display text-base font-semibold text-ink mb-4">
                Eligibility Screening Criteria
              </h3>
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between pb-2 border-b border-line">
                  <span className="text-ink-soft">Minimum CGPA:</span>
                  <span className="font-mono font-medium text-ink">{job.minCgpa} / 10.0</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-line">
                  <span className="text-ink-soft">Max Backlogs:</span>
                  <span className="font-mono font-medium text-ink">
                    {job.allowedBacklogs === 0 ? "No active backlogs" : `${job.allowedBacklogs} allowed`}
                  </span>
                </div>

                <div className="flex justify-between pb-2 border-b border-line">
                  <span className="text-ink-soft">Passing Batch:</span>
                  <span className="font-mono font-medium text-ink">{job.graduationYear}</span>
                </div>

                <div>
                  <span className="text-ink-soft block mb-1.5">Approved Branches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.allowedBranches?.map((b) => (
                      <span
                        key={b}
                        className="font-body text-[11px] px-2 py-0.5 rounded bg-paper-dim text-ink"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-display text-base font-semibold text-ink mb-4">
                Key Parameters & Timeline
              </h3>
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between pb-2 border-b border-line">
                  <span className="text-ink-soft">CTC / Stipend:</span>
                  <span className="font-mono font-medium text-ink">{job.ctc}</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-line">
                  <span className="text-ink-soft">Work Mode:</span>
                  <span className="font-medium text-ink">{job.workMode}</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-line">
                  <span className="text-ink-soft">Interview Mode:</span>
                  <span className="font-medium text-ink">{job.interviewMode || "Virtual"}</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-line">
                  <span className="text-ink-soft">Application Deadline:</span>
                  <span className="font-mono font-medium text-ink">
                    {job.deadlineLabel || job.deadline}
                  </span>
                </div>

                {job.joiningDate && (
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Joining Date:</span>
                    <span className="font-medium text-ink">
                      {formatDisplayDate(job.joiningDate)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {job.selectionProcess && (
              <Card>
                <h3 className="font-display text-base font-semibold text-ink mb-2">
                  Selection Stages
                </h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  {job.selectionProcess}
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Close Job Confirmation Modal */}
      {confirmCloseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-coral mb-2">
              <AlertTriangle size={20} />
              <h3 className="font-display text-lg font-semibold text-ink">Close Job Opening</h3>
            </div>
            <p className="font-body text-xs text-ink-soft leading-relaxed">
              Are you sure you want to close applications for{" "}
              <strong className="text-ink">{job.title}</strong>? Active applications will remain
              accessible, but students will no longer be able to submit new applications.
            </p>
            <div className="flex items-center justify-end gap-3 pt-5">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setConfirmCloseOpen(false)}
                className="!py-2 !text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleCloseJob}
                className="!py-2 !text-xs !bg-coral hover:!bg-coral-dark text-white border-coral"
              >
                Yes, Close Applications
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
