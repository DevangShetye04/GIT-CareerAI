import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Award,
  Layers,
  Zap,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getSkillGapData,
  getStudentProfile,
  updateStudentProfile,
  subscribe,
} from "../../services/studentService.js";

export default function StudentSkillGap() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "Full Stack Developer";

  const [skillGapData] = useState(getSkillGapData());
  const [selectedRoleTitle, setSelectedRoleTitle] = useState(initialRole);
  const [profile, setProfile] = useState(getStudentProfile());
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const unsub = subscribe(() => {
      setProfile(getStudentProfile());
    });
    return () => unsub();
  }, []);

  // Update role if query param changes
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && skillGapData[roleParam]) {
      setSelectedRoleTitle(roleParam);
    }
  }, [searchParams, skillGapData]);

  const handleRoleChange = (newRole) => {
    setSelectedRoleTitle(newRole);
    setSearchParams({ role: newRole });
  };

  const activeData = skillGapData[selectedRoleTitle] || skillGapData["Full Stack Developer"];

  const handleAddSkill = (skill) => {
    const currentSkills = profile.technicalSkills || [];
    if (currentSkills.includes(skill)) {
      setToastMessage(`"${skill}" is already in your profile.`);
      return;
    }

    updateStudentProfile({
      technicalSkills: [...currentSkills, skill],
    });

    setToastMessage(`Added "${skill}" to your Technical Skills in Student Profile!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Skill Gap &amp; Learning Roadmap
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Compare your profile against industry standards for campus recruitment and close identified skill gaps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="amber">
            <Sparkles size={12} /> Target Role Analyzer
          </Pill>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-teal-soft text-teal-dark border border-teal/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Role Selection Bar */}
      <Card className="!p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Target Career Track:
            </span>
            <select
              value={selectedRoleTitle}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-line bg-paper text-sm font-semibold text-ink focus:outline-none focus:border-ink cursor-pointer"
            >
              {Object.keys(skillGapData).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-body text-xs text-ink-soft">Calculated Match:</span>
            <span className="font-mono text-lg font-bold text-teal-dark bg-teal-soft px-3 py-0.5 rounded-lg">
              {activeData.matchScore}%
            </span>
          </div>
        </div>
      </Card>

      {/* Comparison Grid: Matched Skills vs Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-teal" />
              <h3 className="font-display text-base font-semibold text-ink">
                Matched Skills ({activeData.matchedSkills.length})
              </h3>
            </div>
            <Pill tone="teal">Verified in Profile</Pill>
          </div>
          <p className="font-body text-xs text-ink-soft mb-4">
            These skills on your profile directly align with recruiter expectations for this role.
          </p>
          <div className="flex flex-wrap gap-2">
            {activeData.matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-xl bg-teal-soft/60 text-teal-dark border border-teal/20 font-medium"
              >
                <CheckCircle2 size={13} className="text-teal" />
                {skill}
              </span>
            ))}
          </div>
        </Card>

        {/* Missing / Gap Skills */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-dark" />
              <h3 className="font-display text-base font-semibold text-ink">
                Identified Skill Gaps ({activeData.missingSkills.length})
              </h3>
            </div>
            <Pill tone="amber">Requires Prep</Pill>
          </div>
          <p className="font-body text-xs text-ink-soft mb-4">
            Acquiring these competencies will boost your ATS score and interview shortlist chances.
          </p>
          <div className="flex flex-wrap gap-2">
            {activeData.missingSkills.map((skill, idx) => (
              <div
                key={idx}
                className="inline-flex items-center justify-between gap-2 font-mono text-xs px-3 py-1 rounded-xl bg-amber-soft/50 text-amber-dark border border-amber/30 font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  title="Add to profile if already learned"
                  className="hover:text-ink text-ink-soft transition-colors"
                >
                  <PlusCircle size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended Learning Roadmap */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <BookOpen size={18} /> Recommended Upskilling Sprints
            </h3>
            <p className="font-body text-xs text-ink-soft mt-0.5">
              Targeted self-paced curriculum curated for {selectedRoleTitle} campus selection rounds.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {(activeData.learningRoadmap || []).map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-line bg-card hover:border-ink/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-soft text-amber-dark flex items-center justify-center font-mono text-sm font-bold shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-sm font-semibold text-ink">{step.title}</h4>
                    <Pill tone="neutral" className="text-[11px]">
                      {step.estTime}
                    </Pill>
                  </div>
                  <p className="font-body text-xs text-ink-soft mt-1">{step.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-ink-faint">
                    <span>Key Topics:</span>
                    <span className="text-ink-soft font-medium">{step.topics}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="!py-1.5 !px-3 !text-xs"
                  onClick={() => handleAddSkill(step.skill)}
                >
                  Mark as Acquired
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
