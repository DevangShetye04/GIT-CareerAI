import { useState, useEffect } from "react";
import Card from "../ui/Card.jsx";
import { getCompanyStats, subscribe } from "../../services/companyService.js";

function BarSegment({ label, value, total, toneClass }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between font-body text-xs text-ink-soft mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-ink">
          {value} <span className="text-ink-faint text-[11px]">({pct}%)</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-paper-dim overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${toneClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function EligibilityOverview() {
  const [stats, setStats] = useState(getCompanyStats);

  useEffect(() => {
    return subscribe(() => {
      setStats(getCompanyStats());
    });
  }, []);

  const { totalApplicants, eligibleCandidates, averageAtsMatch, highestAtsMatch } = stats;
  const notEligible = Math.max(0, totalApplicants - eligibleCandidates);

  return (
    <Card className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">Screening & ATS Overview</h3>
          <p className="font-body text-xs text-ink-faint mt-0.5">
            Eligibility criteria vs. AI Resume Keyword compatibility.
          </p>
        </div>
        <div className="font-body text-xs text-ink-soft bg-paper-dim px-3 py-1.5 rounded-lg">
          Total Screened: <strong className="text-ink">{totalApplicants}</strong>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 pt-2">
        {/* Academic Eligibility Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm font-semibold text-ink">
              Academic Eligibility
            </h4>
            <span className="font-body text-[11px] text-ink-faint">
              Based on CGPA, Branch & Backlogs
            </span>
          </div>

          <BarSegment
            label="Eligible Candidates"
            value={eligibleCandidates}
            total={totalApplicants}
            toneClass="bg-teal"
          />

          <BarSegment
            label="Not Eligible"
            value={notEligible}
            total={totalApplicants}
            toneClass="bg-coral"
          />

          <p className="font-body text-[11px] text-ink-faint pt-1 leading-relaxed">
            Candidates meeting minimum CGPA, approved branch, graduation year, and backlog limits.
          </p>
        </div>

        {/* ATS Resume Match Distribution */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm font-semibold text-ink">
              Resume & ATS Match Intelligence
            </h4>
            <span className="font-body text-[11px] text-ink-faint">
              Keyword & Skill Alignment
            </span>
          </div>

          <div>
            <div className="flex justify-between font-body text-xs text-ink-soft mb-1.5">
              <span>Average ATS Match Score</span>
              <span className="font-mono font-medium text-ink">{averageAtsMatch}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-paper-dim overflow-hidden">
              <div
                className="h-full rounded-full bg-amber transition-all duration-500"
                style={{ width: `${averageAtsMatch}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-body text-xs text-ink-soft mb-1.5">
              <span>Highest Candidate ATS Match</span>
              <span className="font-mono font-medium text-teal-dark">{highestAtsMatch}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-paper-dim overflow-hidden">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500"
                style={{ width: `${highestAtsMatch}%` }}
              />
            </div>
          </div>

          <p className="font-body text-[11px] text-ink-faint pt-1 leading-relaxed">
            Note: ATS Match and Eligibility are independent. Candidates with high ATS match can still be academically not eligible.
          </p>
        </div>
      </div>
    </Card>
  );
}
