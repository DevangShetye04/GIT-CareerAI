import {
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import Pill from "../components/ui/Pill.jsx";
import Button from "../components/ui/Button.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import {
  SUMMARY,
  RESUME_ANALYSIS,
  CAREER_RECS,
  COMPANIES,
  APPLICATIONS,
  STATUS_TONE,
} from "../data/mockData.js";

function WelcomeSection() {
  const { user } = useAuth();
  const name = user?.name || user?.fullName?.split(/\s+/)[0] || "Student";

  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
        Welcome back, {name}! 👋
      </h1>
      <p className="font-body text-sm mt-1 text-ink-soft">
        Let&apos;s improve your career readiness and find the right opportunities.
      </p>
    </div>
  );
}

function SummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {SUMMARY.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  );
}

function ResumeAnalysisCard() {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-ink">Resume Analysis</h3>
        <Pill tone="teal">
          <CheckCircle2 size={12} /> {RESUME_ANALYSIS.status}
        </Pill>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center font-mono text-lg font-semibold shrink-0 bg-amber-soft text-amber-dark border-[3px] border-amber">
            {RESUME_ANALYSIS.score}
          </div>
          <div>
            <div className="font-body text-sm text-ink">ATS Score</div>
            <div className="font-body text-xs text-ink-faint">out of 100</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-body text-xs text-ink-faint">Last analyzed</div>
          <div className="font-body text-sm text-ink-soft">{RESUME_ANALYSIS.lastAnalyzed}</div>
        </div>
        <Button variant="primary">
          View Analysis <ChevronRight size={15} />
        </Button>
      </div>
    </Card>
  );
}

function CareerRecommendations() {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-ink">Career Recommendations</h3>
        <Pill>
          <Sparkles size={11} /> AI matched
        </Pill>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {CAREER_RECS.map((r, i) => (
          <div key={i} className="rounded-xl p-4 flex flex-col justify-between border border-line">
            <div>
              <div className="font-body font-medium text-sm mb-2 text-ink">{r.role}</div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1.5 rounded-full flex-1 bg-paper-dim">
                  <div
                    className={`h-1.5 rounded-full ${
                      r.match >= 80 ? "bg-teal" : r.match >= 70 ? "bg-amber" : "bg-coral"
                    }`}
                    style={{ width: `${r.match}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-medium text-ink-soft">{r.match}%</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-center !py-2 !text-xs">
              View Roadmap <ArrowRight size={13} />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecommendedCompanies() {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-ink">Recommended Companies</h3>
        <Pill tone="teal">
          <TrendingUp size={11} /> Based on your profile
        </Pill>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {COMPANIES.map((c, i) => (
          <div key={i} className="rounded-xl p-4 border border-line">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-semibold text-sm bg-paper-dim text-ink">
                {c.name[0]}
              </div>
              <Pill tone={c.atsMatch >= 80 ? "teal" : c.atsMatch >= 65 ? "amber" : "coral"}>
                {c.atsMatch}% ATS
              </Pill>
            </div>
            <div className="font-body font-medium text-sm mt-2 text-ink">{c.name}</div>
            <div className="font-body text-xs mb-2 text-ink-faint">{c.role}</div>
            <Pill tone={c.eligible ? "teal" : "coral"}>
              {c.eligible ? <CheckCircle2 size={11} /> : null}{" "}
              {c.eligible ? "Eligible" : "Not Eligible"}
            </Pill>
            <Button variant="ghost" className="w-full justify-center !py-2 !text-xs mt-3">
              View Details <ArrowRight size={13} />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentApplications() {
  const columns = [
    { key: "company", label: "Company", className: "font-medium text-ink" },
    { key: "role", label: "Job Role", className: "text-ink-soft" },
    { key: "date", label: "Applied Date", className: "font-mono text-xs text-ink-soft" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Pill tone={STATUS_TONE[row.status]}>{row.status}</Pill>,
    },
  ];

  return (
    <Card padded={false}>
      <div className="flex items-center justify-between p-5 pb-0 mb-1">
        <h3 className="font-display text-lg font-semibold text-ink">Recent Applications</h3>
        <button type="button" className="font-body text-xs underline text-ink-faint">
          View all
        </button>
      </div>
      <DataTable columns={columns} rows={APPLICATIONS} />
      <div className="h-4" />
    </Card>
  );
}

export default function StudentDashboard() {
  return (
    <>
      <WelcomeSection />
      <SummaryCards />
      <ResumeAnalysisCard />
      <CareerRecommendations />
      <RecommendedCompanies />
      <RecentApplications />
    </>
  );
}
