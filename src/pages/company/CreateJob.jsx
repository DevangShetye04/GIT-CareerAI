import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, Plus, X, AlertCircle } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Pill from "../../components/ui/Pill.jsx";
import { createJob } from "../../services/companyService.js";
import {
  BRANCHES_LIST,
  WORK_MODES,
  JOB_TYPES,
  formatDisplayDate,
} from "../../data/companyMockData.js";

export default function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    department: "Software Engineering",
    jobType: "Full-Time",
    workMode: "Hybrid",
    location: "Mumbai",
    ctc: "₹7.0 - 9.0 LPA",
    vacancies: "10",
    joiningDate: "2026-07-15",
    deadline: "2026-10-15",
    selectionProcess: "Online Assessment -> Technical Interview -> HR Round",
    interviewMode: "Hybrid (Virtual & Campus)",
    minCgpa: "7.0",
    allowedBacklogs: "0",
    graduationYear: "2026",
    allowedBranches: ["Computer Engineering", "Information Technology"],
    description:
      "We are looking for passionate campus recruits to join our engineering teams. You will contribute to mission-critical applications, learn cutting-edge tools, and collaborate closely with industry mentors.",
    requiredSkills: ["Java", "SQL", "Git", "REST API"],
    preferredSkills: ["Spring Boot", "Docker", "AWS"],
  });

  const [newRequiredSkill, setNewRequiredSkill] = useState("");
  const [newPreferredSkill, setNewPreferredSkill] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function toggleBranch(branch) {
    setFormData((prev) => {
      const exists = prev.allowedBranches.includes(branch);
      const updated = exists
        ? prev.allowedBranches.filter((b) => b !== branch)
        : [...prev.allowedBranches, branch];
      return { ...prev, allowedBranches: updated };
    });
    if (errors.allowedBranches) {
      setErrors((prev) => ({ ...prev, allowedBranches: "" }));
    }
  }

  function addSkill(type) {
    if (type === "required") {
      const trimmed = newRequiredSkill.trim();
      if (trimmed && !formData.requiredSkills.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          requiredSkills: [...prev.requiredSkills, trimmed],
        }));
        setNewRequiredSkill("");
      }
    } else {
      const trimmed = newPreferredSkill.trim();
      if (trimmed && !formData.preferredSkills.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          preferredSkills: [...prev.preferredSkills, trimmed],
        }));
        setNewPreferredSkill("");
      }
    }
  }

  function removeSkill(type, skill) {
    if (type === "required") {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        preferredSkills: prev.preferredSkills.filter((s) => s !== skill),
      }));
    }
  }

  function validate() {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Job Title is required";
    if (!formData.department.trim()) errs.department = "Department is required";
    if (!formData.location.trim()) errs.location = "Job Location is required";
    if (!formData.ctc.trim()) errs.ctc = "Salary / CTC range is required";
    
    // Vacancies validation
    if (!formData.vacancies || Number(formData.vacancies) < 1 || !Number.isInteger(Number(formData.vacancies))) {
      errs.vacancies = "Must specify at least 1 vacancy (whole number)";
    }

    // Application deadline validation
    if (!formData.deadline) {
      errs.deadline = "Application Deadline is required";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (formData.deadline < today) {
        errs.deadline = "Application deadline cannot be in the past";
      }
    }

    // Joining date validation
    if (!formData.joiningDate) {
      errs.joiningDate = "Tentative joining date is required";
    } else if (formData.deadline && formData.joiningDate < formData.deadline) {
      errs.joiningDate = "Joining date cannot be earlier than application deadline";
    }

    if (!formData.description.trim()) errs.description = "Job description is required";
    if (formData.allowedBranches.length === 0) {
      errs.allowedBranches = "Select at least one eligible engineering branch";
    }
    if (formData.requiredSkills.length === 0) {
      errs.requiredSkills = "Add at least one required skill";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(status = "Active") {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    const payload = {
      ...formData,
      status,
      vacancies: Number(formData.vacancies) || 1,
      minCgpa: Number(formData.minCgpa) || 6.0,
      allowedBacklogs: Number(formData.allowedBacklogs) || 0,
      deadlineLabel: formatDisplayDate(formData.deadline),
    };

    createJob(payload);
    setSuccessMsg(
      status === "Draft"
        ? "Job draft successfully saved!"
        : "Job opening submitted! Pending approval by College Placement Cell."
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setSubmitting(false);
      navigate("/company/jobs");
    }, 700);
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Back button & Page title */}
      <div className="mb-6">
        <Link
          to="/company/jobs"
          className="inline-flex items-center gap-1.5 font-body text-xs text-ink-soft hover:text-ink transition-colors mb-3"
        >
          <ArrowLeft size={14} /> Back to Job Listings
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Post a New Campus Job Opening
        </h1>
        <p className="font-body text-sm mt-1 text-ink-soft">
          Define role specifications, placement eligibility criteria, and interview parameters.
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-teal-soft border border-teal/20 flex items-center gap-3 text-teal-dark font-body text-sm animate-in fade-in">
          <Check size={18} className="text-teal shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-coral-soft border border-coral/20 flex items-start gap-3">
          <AlertCircle size={18} className="text-coral-dark shrink-0 mt-0.5" />
          <div>
            <h4 className="font-body text-sm font-semibold text-coral-dark">
              Please fix the errors below before submitting:
            </h4>
            <ul className="list-disc list-inside font-body text-xs text-coral-dark mt-1 space-y-0.5">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* SECTION 1: Basic Role Information */}
        <Card>
          <h2 className="font-display text-lg font-semibold text-ink mb-1">
            1. Role & Compensation Information
          </h2>
          <p className="font-body text-xs text-ink-faint mb-5">
            Key details displayed prominently to eligible students on their dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="title"
              label="Job Title *"
              placeholder="e.g. Associate Java Developer"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
            />

            <FormField
              id="department"
              label="Department / Unit *"
              placeholder="e.g. Cloud & Digital Services"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              error={errors.department}
            />

            <FormField
              id="jobType"
              label="Job Type *"
              as="select"
              value={formData.jobType}
              onChange={(e) => handleChange("jobType", e.target.value)}
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </FormField>

            <FormField
              id="workMode"
              label="Work Mode *"
              as="select"
              value={formData.workMode}
              onChange={(e) => handleChange("workMode", e.target.value)}
            >
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </FormField>

            <FormField
              id="location"
              label="Job Location *"
              placeholder="e.g. Mumbai, Pune, Bangalore"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              error={errors.location}
            />

            <FormField
              id="ctc"
              label="Package / CTC (Annual or Monthly) *"
              placeholder="e.g. ₹7.5 - 9.0 LPA or ₹25,000 / month"
              value={formData.ctc}
              onChange={(e) => handleChange("ctc", e.target.value)}
              error={errors.ctc}
            />

            <FormField
              id="vacancies"
              label="Number of Vacancies *"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 15"
              value={formData.vacancies}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^[0-9]+$/.test(val)) {
                  handleChange("vacancies", val);
                }
              }}
              error={errors.vacancies}
            />

            <FormField
              id="joiningDate"
              label="Tentative Joining Date *"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.joiningDate}
              onChange={(e) => handleChange("joiningDate", e.target.value)}
              error={errors.joiningDate}
            />
          </div>
        </Card>

        {/* SECTION 2: Academic Eligibility Criteria */}
        <Card>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-lg font-semibold text-ink">
              2. Academic Eligibility Rules
            </h2>
            <Pill tone="teal">Screening Gate</Pill>
          </div>
          <p className="font-body text-xs text-ink-faint mb-5">
            Candidates who do not meet these criteria will automatically be marked &quot;Not Eligible&quot;.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <FormField
              id="minCgpa"
              label="Minimum CGPA (out of 10) *"
              type="number"
              step="0.1"
              value={formData.minCgpa}
              onChange={(e) => handleChange("minCgpa", e.target.value)}
            />

            <FormField
              id="allowedBacklogs"
              label="Max Active Backlogs Allowed *"
              type="number"
              value={formData.allowedBacklogs}
              onChange={(e) => handleChange("allowedBacklogs", e.target.value)}
            />

            <FormField
              id="graduationYear"
              label="Eligible Passing Batch *"
              value={formData.graduationYear}
              onChange={(e) => handleChange("graduationYear", e.target.value)}
            />
          </div>

          <div>
            <label className="block font-body text-sm font-medium text-ink-soft mb-2">
              Allowed Branches / Disciplines *
            </label>
            <div className="flex flex-wrap gap-2">
              {BRANCHES_LIST.map((branch) => {
                const selected = formData.allowedBranches.includes(branch);
                return (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => toggleBranch(branch)}
                    className={`font-body text-xs px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                      selected
                        ? "bg-teal text-white border-teal shadow-xs"
                        : "bg-paper-dim text-ink-soft border-line hover:border-teal/50"
                    }`}
                  >
                    {selected && <Check size={13} />}
                    {branch}
                  </button>
                );
              })}
            </div>
            {errors.allowedBranches && (
              <p className="font-body text-xs text-coral mt-1.5">{errors.allowedBranches}</p>
            )}
          </div>
        </Card>

        {/* SECTION 3: Job Description & Skill Requirements */}
        <Card>
          <h2 className="font-display text-lg font-semibold text-ink mb-1">
            3. Description & Skill Matching
          </h2>
          <p className="font-body text-xs text-ink-faint mb-5">
            These skills power the AI-driven ATS score matching for applicant resumes.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block font-body text-sm font-medium text-ink-soft mb-1.5">
                Job Overview & Role Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full font-body text-sm text-ink bg-card border border-line rounded-xl p-3.5 focus:border-teal transition-colors"
                placeholder="Describe role expectations, day-to-day duties, and team context..."
              />
              {errors.description && (
                <p className="font-body text-xs text-coral mt-1">{errors.description}</p>
              )}
            </div>

            {/* Required Skills Chips */}
            <div>
              <label className="block font-body text-sm font-medium text-ink-soft mb-1.5">
                Required Technical Skills (High Weight in ATS Match) *
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Java, SQL, React (press Add)"
                  value={newRequiredSkill}
                  onChange={(e) => setNewRequiredSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill("required"))}
                  className="font-body text-sm px-3.5 py-2 bg-paper-dim border border-line rounded-xl text-ink focus:bg-card focus:border-teal"
                />
                <Button variant="ghost" onClick={() => addSkill("required")} className="!py-2 !text-xs">
                  <Plus size={14} /> Add Skill
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {formData.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="font-body text-xs font-medium px-2.5 py-1 rounded-lg bg-teal-soft text-teal-dark inline-flex items-center gap-1.5"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill("required", skill)}
                      className="hover:text-coral"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {errors.requiredSkills && (
                <p className="font-body text-xs text-coral mt-1">{errors.requiredSkills}</p>
              )}
            </div>

            {/* Preferred Skills Chips */}
            <div>
              <label className="block font-body text-sm font-medium text-ink-soft mb-1.5">
                Preferred / Nice-to-Have Skills (Bonus Weight)
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Docker, AWS, Redis (press Add)"
                  value={newPreferredSkill}
                  onChange={(e) => setNewPreferredSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill("preferred"))}
                  className="font-body text-sm px-3.5 py-2 bg-paper-dim border border-line rounded-xl text-ink focus:bg-card focus:border-teal"
                />
                <Button variant="ghost" onClick={() => addSkill("preferred")} className="!py-2 !text-xs">
                  <Plus size={14} /> Add Skill
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.preferredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="font-body text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-soft text-amber-dark inline-flex items-center gap-1.5"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill("preferred", skill)}
                      className="hover:text-coral"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 4: Selection Process & Timeline */}
        <Card>
          <h2 className="font-display text-lg font-semibold text-ink mb-1">
            4. Hiring Process & Timeline
          </h2>
          <p className="font-body text-xs text-ink-faint mb-5">
            Set application deadlines and explain interview rounds to applicants.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="deadline"
              label="Application Deadline *"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              error={errors.deadline}
            />

            <FormField
              id="interviewMode"
              label="Interview Mode"
              placeholder="e.g. Virtual (Teams) or On-Campus Room 204"
              value={formData.interviewMode}
              onChange={(e) => handleChange("interviewMode", e.target.value)}
            />

            <div className="md:col-span-2">
              <FormField
                id="selectionProcess"
                label="Hiring Process Stages"
                placeholder="e.g. Online Aptitude -> Technical Interview -> HR Round"
                value={formData.selectionProcess}
                onChange={(e) => handleChange("selectionProcess", e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Link to="/company/jobs" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto justify-center">
              Cancel
            </Button>
          </Link>

          <Button
            variant="ghost"
            onClick={() => handleSubmit("Draft")}
            loading={submitting}
            className="w-full sm:w-auto justify-center"
          >
            Save Draft
          </Button>

          <Button
            variant="primary"
            onClick={() => handleSubmit("Active")}
            loading={submitting}
            className="w-full sm:w-auto justify-center"
          >
            Publish Job
          </Button>
        </div>
      </form>
    </div>
  );
}
