import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  AlertTriangle,
  GraduationCap,
  Calendar,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getJobApprovals,
  approveJob,
  rejectJob,
  subscribe,
} from "../../services/adminService.js";

const STATUS_TONES = {
  Approved: "teal",
  Pending: "amber",
  Rejected: "coral",
};

export default function JobApprovals() {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get("highlight");

  const [statusFilter, setStatusFilter] = useState("All");
  const [approvals, setApprovals] = useState(() => getJobApprovals());
  const [toast, setToast] = useState("");
  const [rejectionModal, setRejectionModal] = useState({ open: false, jobId: null, reason: "" });

  useEffect(() => {
    const unsub = subscribe(() => {
      setApprovals(getJobApprovals());
    });
    return () => unsub();
  }, []);

  const filteredApprovals =
    statusFilter === "All"
      ? approvals
      : approvals.filter((a) => a.status === statusFilter);

  const handleApprove = (id) => {
    approveJob(id);
    setToast(`Job opening #${id} approved! Campus students can now view and apply.`);
    setTimeout(() => setToast(""), 3500);
  };

  const handleConfirmReject = () => {
    if (!rejectionModal.jobId) return;
    rejectJob(rejectionModal.jobId, rejectionModal.reason || "Eligibility criteria does not match college guidelines.");
    setToast(`Job opening #${rejectionModal.jobId} rejected.`);
    setRejectionModal({ open: false, jobId: null, reason: "" });
    setTimeout(() => setToast(""), 3500);
  };

  const pendingCount = approvals.filter((a) => a.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Job Approvals
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Review compensation packages, eligibility cutoffs, and campus norms before publishing corporate job openings to students.
          </p>
        </div>

        {pendingCount > 0 && (
          <Pill tone="amber" className="text-xs">
            {pendingCount} Pending Review
          </Pill>
        )}
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

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-2">
        {["All", "Pending", "Approved", "Rejected"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
              statusFilter === st
                ? "bg-ink text-paper"
                : "bg-card border border-line text-ink-soft hover:text-ink"
            }`}
          >
            {st} ({st === "All" ? approvals.length : approvals.filter((a) => a.status === st).length})
          </button>
        ))}
      </div>

      {/* Approvals List */}
      {filteredApprovals.length === 0 ? (
        <Card className="text-center py-12">
          <CheckSquare size={36} className="mx-auto text-ink-faint mb-3" />
          <p className="font-display text-base font-semibold text-ink">
            {statusFilter === "Pending" ? "No pending job approvals." : "No job approvals found."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map((job) => {
            const isHighlighted = highlightedId && String(job.id) === String(highlightedId);

            return (
              <Card
                key={job.id}
                className={`transition-all ${
                  isHighlighted ? "border-2 border-amber ring-2 ring-amber/20" : ""
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-line">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-paper-dim border border-line flex items-center justify-center font-display font-bold text-lg text-ink shrink-0">
                      {job.company?.[0] || "C"}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-semibold text-ink">
                          {job.title}
                        </h3>
                        <Pill tone={STATUS_TONES[job.status] || "neutral"}>
                          {job.status}
                        </Pill>
                      </div>
                      <p className="font-body text-xs text-ink-soft flex items-center gap-1.5 mt-0.5">
                        <Building2 size={13} /> {job.company} • Submitted by{" "}
                        <span className="font-medium text-ink">{job.submittedBy}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start lg:self-center">
                    {job.status === "Pending" ? (
                      <>
                        <Button
                          variant="primary"
                          className="!py-1.5 !px-3 !text-xs"
                          onClick={() => handleApprove(job.id)}
                        >
                          <CheckCircle2 size={13} /> Approve Job
                        </Button>
                        <Button
                          variant="ghost"
                          className="!py-1.5 !px-3 !text-xs !text-coral hover:!bg-coral-soft hover:!border-coral/30"
                          onClick={() =>
                            setRejectionModal({
                              open: true,
                              jobId: job.id,
                              reason: "",
                            })
                          }
                        >
                          <XCircle size={13} /> Reject Job
                        </Button>
                      </>
                    ) : (
                      <span className="font-body text-xs text-ink-faint">
                        Status locked: {job.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Details & Cutoffs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-body">
                  <div className="p-2.5 rounded-xl bg-paper-dim/60">
                    <div className="text-ink-faint text-[11px] flex items-center gap-1">
                      <IndianRupee size={11} /> Offered CTC
                    </div>
                    <div className="font-mono font-semibold text-ink mt-0.5">{job.ctc}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-paper-dim/60">
                    <div className="text-ink-faint text-[11px] flex items-center gap-1">
                      <GraduationCap size={11} /> CGPA Cutoff
                    </div>
                    <div className="font-mono font-semibold text-ink mt-0.5">
                      Min {job.minCgpa} • Max Backlogs: {job.allowedBacklogs}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-paper-dim/60">
                    <div className="text-ink-faint text-[11px] flex items-center gap-1">
                      <Briefcase size={11} /> Work Mode &amp; Type
                    </div>
                    <div className="font-medium text-ink mt-0.5">
                      {job.workMode} • {job.type}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-paper-dim/60">
                    <div className="text-ink-faint text-[11px] flex items-center gap-1">
                      <Calendar size={11} /> Application Window
                    </div>
                    <div className="font-mono text-ink mt-0.5">
                      Deadline: {job.deadline}
                    </div>
                  </div>
                </div>

                {/* Branches Allowed */}
                <div className="pt-3 text-xs font-body text-ink-soft flex items-center gap-2">
                  <span className="font-medium text-ink">Eligible Branches:</span>
                  <div className="flex flex-wrap gap-1">
                    {(job.allowedBranches || []).map((b, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-paper-dim text-ink font-mono text-[11px]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {job.rejectionReason && (
                  <div className="mt-3 p-2.5 rounded-lg bg-coral-soft text-coral-dark text-xs flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>Rejection Reason: {job.rejectionReason}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-card border border-line rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-display text-base font-semibold text-ink">
              Reject Job Posting #{rejectionModal.jobId}
            </h3>
            <p className="font-body text-xs text-ink-soft">
              Specify feedback for the recruiter explaining why this job listing does not comply with college placement guidelines.
            </p>

            <textarea
              rows={3}
              placeholder="e.g., Minimum CTC does not meet college engineering standards, or branch restrictions invalid."
              value={rejectionModal.reason}
              onChange={(e) =>
                setRejectionModal((prev) => ({ ...prev, reason: e.target.value }))
              }
              className="w-full p-3 rounded-xl border border-line bg-paper text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setRejectionModal({ open: false, jobId: null, reason: "" })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="!bg-coral !text-paper hover:!opacity-90"
                onClick={handleConfirmReject}
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
