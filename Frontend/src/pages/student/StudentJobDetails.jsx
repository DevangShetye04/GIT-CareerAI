import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Send,
  Calendar,
  Layers,
  GraduationCap,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getStudentJobById,
  getResumeData,
  applyToJob,
  subscribe,
} from "../../services/studentService.js";

export default function StudentJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(() => getStudentJobById(id));
  const [resume, setResume] = useState(getResumeData());
  const [isApplying, setIsApplying] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const unsub = subscribe(() => {
      setJob(getStudentJobById(id));
      setResume(getResumeData());
    });
    return () => unsub();
  }, [id]);

  if (!job) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/jobs")}>
          <ArrowLeft size={16} /> Back to Job Openings
        </Button>
        <Card className="text-center py-12">
          <Briefcase size={36} className="mx-auto text-ink-faint mb-3" />
          <h2 className="font-display text-lg font-semibold text-ink">Job Posting Not Found</h2>
          <p className="font-body text-xs text-ink-soft mt-1 mb-4">
            The job opening you are looking for does not exist or has closed.
          </p>
          <Button variant="primary" onClick={() => navigate("/jobs")}>
            Explore Active Jobs
          </Button>
        </Card>
      </div>
    );
  }

  const handleApply = () => {
    if (!resume.hasResume) {
      setToast({
        show: true,
        message: "Please upload your resume before submitting your application.",
        type: "error",
      });
      return;
    }

    if (!job.isEligible) {
      setToast({
        show: true,
        message: "You do not meet the minimum eligibility criteria set by this recruiter.",
        type: "error",
      });
      return;
    }

    setIsApplying(true);
    setTimeout(() => {
      const res = applyToJob(job.id);
      setIsApplying(false);
      if (res.success) {
        setToast({
          show: true,
          message: `Application submitted successfully for ${job.title} at ${job.company}!`,
          type: "success",
        });
      } else {
        setToast({
          show: true,
          message: res.error || "Could not complete application.",
          type: "error",
        });
      }
    }, 800);
  };

  const { eligibilityReasons } = job;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div>
        <Button variant="ghost" onClick={() => navigate("/jobs")} className="!py-1.5 !px-3 !text-xs">
          <ArrowLeft size={14} /> Back to Job Openings
        </Button>
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between animate-in fade-in ${
            toast.type === "success"
              ? "bg-teal-soft text-teal-dark border-teal/20"
              : "bg-coral-soft text-coral-dark border-coral/20"
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast({ show: false, message: "", type: "success" })}
            className="text-xs font-semibold hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Job Header Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-line">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-paper-dim border border-line flex items-center justify-center font-display font-bold text-2xl text-ink shrink-0">
              {job.company?.[0] || "C"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-bold text-ink">{job.title}</h1>
                {job.isApplied ? (
                  <Pill tone="teal">
                    <CheckCircle2 size={12} /> Applied
                  </Pill>
                ) : job.isEligible ? (
                  <Pill tone="teal">
                    <CheckCircle2 size={12} /> Eligible to Apply
                  </Pill>
                ) : (
                  <Pill tone="coral">
                    <XCircle size={12} /> Not Eligible
                  </Pill>
                )}
              </div>
              <p className="font-body text-sm font-medium text-ink-soft flex items-center gap-1.5">
                <Building size={15} /> {job.company}
              </p>
            </div>
          </div>

          <div className="sm:self-start">
            {job.isApplied ? (
              <div className="text-right">
                <Button variant="ghost" disabled className="!cursor-default">
                  <CheckCircle2 size={16} className="text-teal" /> Already Applied
                </Button>
                <div className="font-body text-xs text-ink-soft mt-1">
                  Status: <span className="font-medium text-ink">{job.appliedStatus || "Under Review"}</span>
                </div>
              </div>
            ) : (
              <Button
                variant="primary"
                loading={isApplying}
                disabled={!job.isEligible}
                onClick={handleApply}
                className="w-full sm:w-auto"
              >
                <Send size={15} /> Apply Now
              </Button>
            )}
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-body">
          <div className="p-3 rounded-xl bg-paper-dim/60">
            <div className="text-ink-faint flex items-center gap-1 mb-1">
              <IndianRupee size={12} /> Package / CTC
            </div>
            <div className="font-mono text-sm font-semibold text-ink">{job.ctc || "Best in Industry"}</div>
          </div>
          <div className="p-3 rounded-xl bg-paper-dim/60">
            <div className="text-ink-faint flex items-center gap-1 mb-1">
              <MapPin size={12} /> Location
            </div>
            <div className="font-medium text-ink">{job.location || "Multiple Locations"}</div>
          </div>
          <div className="p-3 rounded-xl bg-paper-dim/60">
            <div className="text-ink-faint flex items-center gap-1 mb-1">
              <Briefcase size={12} /> Work Mode
            </div>
            <div className="font-medium text-ink">{job.workMode || "On-site"} • {job.type || "Full-time"}</div>
          </div>
          <div className="p-3 rounded-xl bg-paper-dim/60">
            <div className="text-ink-faint flex items-center gap-1 mb-1">
              <Clock size={12} /> Application Deadline
            </div>
            <div className="font-mono text-ink">{job.deadline || "Open"}</div>
          </div>
        </div>
      </Card>

      {/* Eligibility Verification Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-semibold text-ink flex items-center gap-2">
            <GraduationCap size={18} /> Campus Eligibility Criteria Check
          </h2>
          <span className="font-body text-xs text-ink-faint">Verified against your Student Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* CGPA */}
          <div
            className={`p-3 rounded-xl border ${
              eligibilityReasons?.cgpa?.passes
                ? "bg-teal-soft/40 border-teal/20 text-teal-dark"
                : "bg-coral-soft/40 border-coral/20 text-coral-dark"
            }`}
          >
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold">CGPA Requirement</span>
              {eligibilityReasons?.cgpa?.passes ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            </div>
            <div className="text-xs font-mono">
              Your: <strong>{eligibilityReasons?.cgpa?.student}</strong> | Req: <strong>&gt;= {eligibilityReasons?.cgpa?.required}</strong>
            </div>
          </div>

          {/* Backlogs */}
          <div
            className={`p-3 rounded-xl border ${
              eligibilityReasons?.backlogs?.passes
                ? "bg-teal-soft/40 border-teal/20 text-teal-dark"
                : "bg-coral-soft/40 border-coral/20 text-coral-dark"
            }`}
          >
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold">Active Backlogs</span>
              {eligibilityReasons?.backlogs?.passes ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            </div>
            <div className="text-xs font-mono">
              Your: <strong>{eligibilityReasons?.backlogs?.student}</strong> | Max: <strong>{eligibilityReasons?.backlogs?.maxAllowed}</strong>
            </div>
          </div>

          {/* Branch */}
          <div
            className={`p-3 rounded-xl border ${
              eligibilityReasons?.branch?.passes
                ? "bg-teal-soft/40 border-teal/20 text-teal-dark"
                : "bg-coral-soft/40 border-coral/20 text-coral-dark"
            }`}
          >
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold">Branch Match</span>
              {eligibilityReasons?.branch?.passes ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            </div>
            <div className="text-xs truncate" title={eligibilityReasons?.branch?.student}>
              Your: <strong>{eligibilityReasons?.branch?.student}</strong>
            </div>
          </div>
        </div>

        {/* Resume attached check */}
        <div className="mt-4 pt-3 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-body">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-ink-soft" />
            {resume.hasResume ? (
              <span className="text-ink">
                Resume attached: <strong className="font-medium">{resume.fileName}</strong> (ATS Score: {resume.atsScore}%)
              </span>
            ) : (
              <span className="text-coral font-medium">
                No resume uploaded. You must upload a resume before applying.
              </span>
            )}
          </div>
          <Link
            to="/resume"
            className="font-medium text-ink underline hover:text-ink-soft shrink-0"
          >
            {resume.hasResume ? "Manage Resume" : "Upload Resume Now"}
          </Link>
        </div>
      </Card>

      {/* Role Description & Responsibilities */}
      <Card>
        <h2 className="font-display text-base font-semibold text-ink mb-3">Job Description &amp; Responsibilities</h2>
        <div className="font-body text-sm text-ink-soft leading-relaxed space-y-3">
          <p>
            {job.description ||
              "As a key member of the engineering team, you will design, develop, and deliver high-performance software modules. You will collaborate closely with product managers, QA engineers, and senior architects to build scalable campus-scale systems."}
          </p>
          <h3 className="font-display text-sm font-semibold text-ink pt-2">Key Responsibilities:</h3>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-ink-soft pl-1">
            <li>Design and build robust web applications and microservices using clean architecture patterns.</li>
            <li>Collaborate with cross-functional teams to define, design, and ship new product features.</li>
            <li>Write clean, maintainable, and thoroughly tested unit &amp; integration code.</li>
            <li>Participate in agile sprint ceremonies, code reviews, and architectural discussions.</li>
          </ul>
        </div>

        {/* Required Technical Skills */}
        <div className="mt-6 pt-5 border-t border-line">
          <h3 className="font-display text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <Layers size={15} /> Required Technical Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {(job.skills || []).map((skill, i) => (
              <span
                key={i}
                className="font-mono text-xs px-3 py-1.5 rounded-lg bg-paper-dim border border-line text-ink font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Selection Process / Rounds */}
        <div className="mt-6 pt-5 border-t border-line">
          <h3 className="font-display text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <Calendar size={15} /> Campus Selection Process
          </h3>
          <div className="grid sm:grid-cols-4 gap-3 text-xs font-body">
            <div className="p-3 rounded-xl bg-paper-dim/60">
              <div className="font-mono font-bold text-ink">Round 1</div>
              <div className="font-medium text-ink-soft mt-0.5">Online Coding &amp; Aptitude</div>
            </div>
            <div className="p-3 rounded-xl bg-paper-dim/60">
              <div className="font-mono font-bold text-ink">Round 2</div>
              <div className="font-medium text-ink-soft mt-0.5">Technical Interview I (DSA &amp; Core)</div>
            </div>
            <div className="p-3 rounded-xl bg-paper-dim/60">
              <div className="font-mono font-bold text-ink">Round 3</div>
              <div className="font-medium text-ink-soft mt-0.5">Technical Interview II (System/Projects)</div>
            </div>
            <div className="p-3 rounded-xl bg-paper-dim/60">
              <div className="font-mono font-bold text-ink">Round 4</div>
              <div className="font-medium text-ink-soft mt-0.5">HR &amp; Placement Discussion</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
