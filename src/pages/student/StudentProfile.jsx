import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Code,
  Sparkles,
  Edit2,
  Save,
  X,
  Check,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Pill from "../../components/ui/Pill.jsx";
import FormField from "../../components/ui/FormField.jsx";
import {
  getStudentProfile,
  updateStudentProfile,
  subscribe,
} from "../../services/studentService.js";

export default function StudentProfile() {
  const [profile, setProfile] = useState(getStudentProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [newTechSkill, setNewTechSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return subscribe(() => {
      const updated = getStudentProfile();
      setProfile(updated);
      if (!isEditing) setFormData(updated);
    });
  }, [isEditing]);

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleNestedChange(section, field, value) {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }

  function addSkill(type) {
    if (type === "technical") {
      const trimmed = newTechSkill.trim();
      if (trimmed && !formData.technicalSkills.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          technicalSkills: [...prev.technicalSkills, trimmed],
        }));
        setNewTechSkill("");
      }
    } else {
      const trimmed = newSoftSkill.trim();
      if (trimmed && !formData.softSkills.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          softSkills: [...prev.softSkills, trimmed],
        }));
        setNewSoftSkill("");
      }
    }
  }

  function removeSkill(type, skill) {
    if (type === "technical") {
      setFormData((prev) => ({
        ...prev,
        technicalSkills: prev.technicalSkills.filter((s) => s !== skill),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        softSkills: prev.softSkills.filter((s) => s !== skill),
      }));
    }
  }

  function validate() {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    if (formData.cgpa === "" || isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
      errs.cgpa = "Enter a valid CGPA between 0 and 10";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;

    updateStudentProfile({
      ...formData,
      cgpa: Number(formData.cgpa),
      backlogs: Number(formData.backlogs) || 0,
    });
    setIsEditing(false);
    setSuccessMsg("Profile information successfully updated.");
    setTimeout(() => setSuccessMsg(""), 3500);
  }

  function handleCancel() {
    setFormData(profile);
    setIsEditing(false);
    setErrors({});
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            My Student Profile
          </h1>
          <p className="font-body text-sm mt-1 text-ink-soft">
            Manage your academic credentials, verified skills, and campus placement preferences.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={15} /> Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleCancel}>
                <X size={15} /> Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Save size={15} /> Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-teal-soft border border-teal/20 text-teal-dark font-body text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {/* Header Profile Summary Card */}
      <Card className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display text-2xl font-bold bg-amber-soft text-amber-dark border-2 border-amber/30 shrink-0">
            {profile.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink truncate">
                {profile.fullName}
              </h2>
              <Pill tone="teal">
                <Check size={12} /> Verified Student
              </Pill>
              <Pill tone="neutral">Batch of {profile.graduationYear}</Pill>
            </div>
            <p className="font-body text-sm text-ink-soft mt-1">
              {profile.branch} · {profile.college}
            </p>
            <div className="font-body text-xs text-ink-faint mt-2 flex flex-wrap items-center gap-4">
              <span>Roll No: <strong className="font-mono text-ink">{profile.rollNo}</strong></span>
              <span>•</span>
              <span>CGPA: <strong className="font-mono text-teal-dark font-semibold">{profile.cgpa} / 10</strong></span>
              <span>•</span>
              <span>Backlogs: <strong className="font-mono text-ink">{profile.backlogs}</strong></span>
              <span>•</span>
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Personal & Academic Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Personal & Academic Info */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-teal" />
                <h3 className="font-display text-base font-semibold text-ink">
                  Academic & Contact Information
                </h3>
              </div>
              <span className="font-body text-xs text-ink-faint">Official College Record</span>
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
                <div>
                  <div className="text-xs text-ink-faint">Full Name</div>
                  <div className="font-medium text-ink mt-0.5">{profile.fullName}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-faint">College Email</div>
                  <div className="font-mono text-ink mt-0.5">{profile.email}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-faint">Phone Number</div>
                  <div className="font-mono text-ink mt-0.5">{profile.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-faint">Current Location</div>
                  <div className="text-ink mt-0.5">{profile.location}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-faint">Engineering Branch</div>
                  <div className="text-ink mt-0.5">{profile.branch}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-faint">Current Semester</div>
                  <div className="text-ink mt-0.5">{profile.semester}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-faint">Cumulative CGPA</div>
                  <div className="font-mono font-semibold text-teal-dark mt-0.5">
                    {profile.cgpa} / 10.0
                  </div>
                </div>
                <div>
                  <div className="text-xs text-ink-faint">Active Standing Backlogs</div>
                  <div className="font-mono text-ink mt-0.5">{profile.backlogs}</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="fullName"
                  label="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  error={errors.fullName}
                />
                <FormField
                  id="email"
                  label="College Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={errors.email}
                />
                <FormField
                  id="phone"
                  label="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  error={errors.phone}
                />
                <FormField
                  id="location"
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
                <FormField
                  id="branch"
                  label="Branch / Discipline *"
                  as="select"
                  value={formData.branch}
                  onChange={(e) => handleChange("branch", e.target.value)}
                >
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </FormField>
                <FormField
                  id="semester"
                  label="Semester"
                  value={formData.semester}
                  onChange={(e) => handleChange("semester", e.target.value)}
                />
                <FormField
                  id="cgpa"
                  label="CGPA (out of 10) *"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => handleChange("cgpa", e.target.value)}
                  error={errors.cgpa}
                />
                <FormField
                  id="backlogs"
                  label="Active Backlogs"
                  type="number"
                  min="0"
                  value={formData.backlogs}
                  onChange={(e) => handleChange("backlogs", e.target.value)}
                />
              </div>
            )}
          </Card>

          {/* Section 2: Projects */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
              <div className="flex items-center gap-2">
                <FolderGit2 size={18} className="text-teal" />
                <h3 className="font-display text-base font-semibold text-ink">
                  Technical Projects
                </h3>
              </div>
              <Pill tone="neutral">ATS Evaluated</Pill>
            </div>

            <div className="space-y-4">
              {profile.projects?.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-line bg-card hover:border-teal/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-semibold text-ink">
                      {proj.title}
                    </h4>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-body text-xs text-teal hover:underline flex items-center gap-1"
                      >
                        GitHub <ArrowRight size={11} />
                      </a>
                    )}
                  </div>
                  <p className="font-body text-xs text-ink-soft mt-1.5 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-paper-dim text-ink-soft"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 3: Internships / Experience */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-teal" />
                <h3 className="font-display text-base font-semibold text-ink">
                  Internships & Work Experience
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {profile.experience?.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl border border-line">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display text-sm font-semibold text-ink">
                        {exp.role}
                      </h4>
                      <div className="font-body text-xs text-ink-faint mt-0.5">
                        {exp.company} · {exp.location}
                      </div>
                    </div>
                    <span className="font-body text-xs text-teal-dark bg-teal-soft px-2 py-0.5 rounded">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="font-body text-xs text-ink-soft mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col): Skills & Placement Preferences */}
        <div className="space-y-6">
          {/* Technical Skills Card */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-teal" />
                <h3 className="font-display text-base font-semibold text-ink">Technical Skills</h3>
              </div>
              <span className="font-body text-xs text-ink-faint">
                {formData.technicalSkills.length} Verified
              </span>
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Docker, TypeScript"
                  value={newTechSkill}
                  onChange={(e) => setNewTechSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill("technical"))}
                  className="w-full font-body text-xs px-3 py-2 bg-paper-dim border border-line rounded-lg text-ink"
                />
                <Button variant="ghost" onClick={() => addSkill("technical")} className="!py-1.5 !px-2.5 !text-xs shrink-0">
                  <Plus size={14} /> Add
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.technicalSkills.map((skill) => (
                <span
                  key={skill}
                  className="font-body text-xs font-medium px-2.5 py-1 rounded-lg bg-teal-soft text-teal-dark inline-flex items-center gap-1.5"
                >
                  {skill}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeSkill("technical", skill)}
                      className="hover:text-coral"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </Card>

          {/* Soft Skills Card */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber" />
                <h3 className="font-display text-base font-semibold text-ink">Soft Skills</h3>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Leadership, Agile"
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill("soft"))}
                  className="w-full font-body text-xs px-3 py-2 bg-paper-dim border border-line rounded-lg text-ink"
                />
                <Button variant="ghost" onClick={() => addSkill("soft")} className="!py-1.5 !px-2.5 !text-xs shrink-0">
                  <Plus size={14} /> Add
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.softSkills.map((skill) => (
                <span
                  key={skill}
                  className="font-body text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-soft text-amber-dark inline-flex items-center gap-1.5"
                >
                  {skill}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeSkill("soft", skill)}
                      className="hover:text-coral"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </Card>

          {/* Placement Preferences Card */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
              <h3 className="font-display text-base font-semibold text-ink">
                Placement Preferences
              </h3>
              <Pill tone="amber">Career Focus</Pill>
            </div>

            {!isEditing ? (
              <div className="space-y-3 font-body text-xs">
                <div>
                  <span className="text-ink-faint">Target Role:</span>
                  <div className="font-medium text-ink mt-0.5">{profile.preferences?.preferredRole}</div>
                </div>
                <div>
                  <span className="text-ink-faint">Desired Package:</span>
                  <div className="font-mono font-medium text-teal-dark mt-0.5">
                    {profile.preferences?.targetPackage}
                  </div>
                </div>
                <div>
                  <span className="text-ink-faint">Preferred Work Mode:</span>
                  <div className="text-ink mt-0.5">
                    {profile.preferences?.workModes?.join(", ")}
                  </div>
                </div>
                <div>
                  <span className="text-ink-faint">Preferred Job Locations:</span>
                  <div className="text-ink mt-0.5">
                    {profile.preferences?.preferredLocations?.join(", ")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <FormField
                  id="preferredRole"
                  label="Target Role"
                  value={formData.preferences?.preferredRole || ""}
                  onChange={(e) => handleNestedChange("preferences", "preferredRole", e.target.value)}
                />
                <FormField
                  id="targetPackage"
                  label="Target Package (CTC)"
                  value={formData.preferences?.targetPackage || ""}
                  onChange={(e) => handleNestedChange("preferences", "targetPackage", e.target.value)}
                />
              </div>
            )}
          </Card>

          {/* Resume Quick Link Card */}
          <Card className="bg-paper/40">
            <h4 className="font-display text-sm font-semibold text-ink mb-1">
              Resume Status
            </h4>
            <p className="font-body text-xs text-ink-soft mb-3">
              Your resume is evaluated for campus drives and company ATS compatibility.
            </p>
            <Link to="/resume">
              <Button variant="ghost" className="w-full justify-center !py-2 !text-xs">
                Manage PDF Resume <ArrowRight size={13} />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
