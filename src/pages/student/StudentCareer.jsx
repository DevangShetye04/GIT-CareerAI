import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Briefcase,
  Award,
  CheckCircle2,
  Building,
  GraduationCap,
  Layers,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getCareerRecommendations,
  getStudentProfile,
  subscribe,
} from "../../services/studentService.js";

export default function StudentCareer() {
  const navigate = useNavigate();
  const [careerRoles] = useState(getCareerRecommendations());
  const [profile, setProfile] = useState(getStudentProfile());

  useEffect(() => {
    const unsub = subscribe(() => {
      setProfile(getStudentProfile());
    });
    return () => unsub();
  }, []);

  const topSkillsLabel = (profile.technicalSkills || ["Java", "React"]).slice(0, 2).join(" & ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            AI Career Recommendations
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Machine learning role matching derived from your coursework, GitHub projects, and campus interview trends.
          </p>
        </div>
        <Pill tone="teal" className="text-xs">
          <Sparkles size={12} /> Model v2.4 Active
        </Pill>
      </div>

      {/* Hero Overview */}
      <Card className="bg-gradient-to-r from-card to-paper-dim/40 border border-line">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Placement Readiness Index
            </span>
            <h2 className="font-display text-2xl font-bold text-ink">
              You are 86% ready for Tech Placements
            </h2>
            <p className="font-body text-xs text-ink-soft max-w-xl">
              Based on your {profile.cgpa || "8.7"} CGPA, verified technical skills in {topSkillsLabel}, and active placement resume, you fall in the top quartile of candidates for Tier-1 technology campus drives.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="w-24 h-24 rounded-full border-4 border-teal bg-teal-soft flex flex-col items-center justify-center text-teal-dark shadow-sm">
              <span className="font-mono text-3xl font-bold">86%</span>
              <span className="text-[10px] uppercase font-semibold">Readiness</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Target Roles Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
            <Target size={18} /> Top Recommended Career Trajectories
          </h2>
          <span className="font-body text-xs text-ink-faint">Ranked by skill affinity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careerRoles.map((role) => (
            <Card
              key={role.id}
              className="flex flex-col justify-between hover:border-ink/30 transition-all hover:shadow-md"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display text-lg font-bold text-ink">{role.title}</h3>
                  <Pill tone={role.match >= 85 ? "teal" : role.match >= 75 ? "amber" : "neutral"}>
                    {role.match}% Match
                  </Pill>
                </div>

                <p className="font-body text-xs text-ink-soft mb-4 leading-relaxed">
                  {role.description}
                </p>

                {/* Match Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-body mb-1">
                    <span className="text-ink-soft">Placement Match</span>
                    <span className="font-mono font-semibold text-ink">{role.match}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-paper-dim overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        role.match >= 85 ? "bg-teal" : role.match >= 75 ? "bg-amber" : "bg-coral"
                      }`}
                      style={{ width: `${role.match}%` }}
                    />
                  </div>
                </div>

                {/* Compensation & Recruiters */}
                <div className="space-y-2 text-xs font-body pt-2 border-t border-line mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft flex items-center gap-1">
                      <TrendingUp size={12} /> Expected CTC:
                    </span>
                    <span className="font-mono font-medium text-ink">{role.salaryRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft flex items-center gap-1">
                      <Building size={12} /> Campus Hirers:
                    </span>
                    <span className="font-medium text-ink truncate max-w-[140px]" title={(role.topCompanies || []).join(", ")}>
                      {(role.topCompanies || []).join(", ")}
                    </span>
                  </div>
                </div>

                {/* Key Skills */}
                <div className="mb-4">
                  <span className="font-body text-[11px] uppercase tracking-wider text-ink-faint font-semibold block mb-1.5">
                    Core Requisites
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(role.keySkills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-paper-dim text-ink"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <Button
                variant="ghost"
                className="w-full justify-center !py-2 !text-xs mt-2"
                onClick={() => navigate(`/skill-gap?role=${encodeURIComponent(role.title)}`)}
              >
                Inspect Skill Gap <ArrowRight size={13} />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* 4-Step Preparation Roadmap */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <GraduationCap size={18} /> Campus Recruitment Preparation Roadmap
            </h2>
            <p className="font-body text-xs text-ink-soft mt-0.5">
              Follow this structured sequence to prepare for Day-1 placements at GIT.
            </p>
          </div>
          <Pill tone="neutral">Semester 7 - 8 Track</Pill>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-paper-dim/60 border border-line/60 relative">
            <span className="w-6 h-6 rounded-full bg-teal text-paper font-mono text-xs font-bold flex items-center justify-center mb-2">
              1
            </span>
            <h4 className="font-display text-sm font-semibold text-ink mb-1">DSA &amp; Aptitude</h4>
            <p className="font-body text-xs text-ink-soft">
              Arrays, Trees, Graphs, Dynamic Programming &amp; quantitative aptitude for Round 1 screening.
            </p>
            <div className="mt-3 text-[11px] font-mono text-teal-dark font-medium flex items-center gap-1">
              <CheckCircle2 size={12} /> 90% Completed
            </div>
          </div>

          <div className="p-4 rounded-xl bg-paper-dim/60 border border-line/60 relative">
            <span className="w-6 h-6 rounded-full bg-teal text-paper font-mono text-xs font-bold flex items-center justify-center mb-2">
              2
            </span>
            <h4 className="font-display text-sm font-semibold text-ink mb-1">Portfolio Projects</h4>
            <p className="font-body text-xs text-ink-soft">
              2 production-grade full stack applications deployed with live URLs and GitHub documentation.
            </p>
            <div className="mt-3 text-[11px] font-mono text-teal-dark font-medium flex items-center gap-1">
              <CheckCircle2 size={12} /> 85% Completed
            </div>
          </div>

          <div className="p-4 rounded-xl bg-paper-dim/60 border border-line/60 relative">
            <span className="w-6 h-6 rounded-full bg-amber text-[#2B1D04] font-mono text-xs font-bold flex items-center justify-center mb-2">
              3
            </span>
            <h4 className="font-display text-sm font-semibold text-ink mb-1">System Design &amp; Mock</h4>
            <p className="font-body text-xs text-ink-soft">
              High-level design, database indexing, caching strategies, and live peer mock interviews.
            </p>
            <div className="mt-3 text-[11px] font-mono text-amber-dark font-medium flex items-center gap-1">
              In Progress
            </div>
          </div>

          <div className="p-4 rounded-xl bg-paper-dim/60 border border-line/60 relative">
            <span className="w-6 h-6 rounded-full bg-paper text-ink border border-line font-mono text-xs font-bold flex items-center justify-center mb-2">
              4
            </span>
            <h4 className="font-display text-sm font-semibold text-ink mb-1">HR &amp; Placement Drive</h4>
            <p className="font-body text-xs text-ink-soft">
              Final behavioral interview preparation, STAR technique answers, and campus placement day.
            </p>
            <div className="mt-3 text-[11px] font-mono text-ink-faint font-medium">
              Upcoming
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
