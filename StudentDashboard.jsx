import React, { useState } from "react";
import {
  LayoutDashboard, User, FileText, Compass, Target, Building2,
  ClipboardList, LogOut, Bell, ChevronRight, CheckCircle2,
  TrendingUp, Sparkles, MapPin, ArrowRight
} from "lucide-react";

/* ============================== DESIGN TOKENS ============================== */
const C = {
  paper: "#F1F4EE",
  paperDim: "#E7EBE1",
  card: "#FFFFFF",
  ink: "#122019",
  inkSoft: "#4B5A50",
  inkFaint: "#8A968C",
  line: "#DBE0D6",
  amber: "#E3A530",
  amberDark: "#8A5F14",
  amberSoft: "#FBF0DA",
  teal: "#1E7A68",
  tealDark: "#12503F",
  tealSoft: "#DFF0EA",
  coral: "#DD5B4C",
  coralDark: "#9E3223",
  coralSoft: "#FBE4E0",
};

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
    .f-display{font-family:'Space Grotesk',sans-serif;}
    .f-body{font-family:'Inter',sans-serif;}
    .f-mono{font-family:'IBM Plex Mono',monospace;}
    ::-webkit-scrollbar{width:8px;height:8px;}
    ::-webkit-scrollbar-thumb{background:${C.line};border-radius:8px;}
  `}</style>
);

/* ============================== MOCK DATA ============================== */
const STUDENT = {
  name: "Bilal",
  fullName: "Bilal Madre",
  branch: "B.E. Computer Engineering",
};

const SUMMARY = [
  { label: "ATS Score", value: "78", suffix: "/100", tone: "amber", icon: FileText, note: "+4 since last scan" },
  { label: "Career Match", value: "Java Backend Developer", suffix: "", tone: "teal", icon: Compass, note: "85% alignment" },
  { label: "Skill Gap", value: "3", suffix: " Skills Missing", tone: "coral", icon: Target, note: "Spring Boot, SQL, AWS" },
  { label: "Roadmap Progress", value: "45", suffix: "%", tone: "teal", icon: MapPin, note: "Year 3 of 4" },
];

const RESUME_ANALYSIS = {
  status: "Analyzed",
  score: 78,
  lastAnalyzed: "22 July 2026",
};

const CAREER_RECS = [
  { role: "Java Backend Developer", match: 85 },
  { role: "Full Stack Developer", match: 75 },
  { role: "Software Engineer", match: 68 },
];

const COMPANIES = [
  { name: "TCS", role: "Java Developer", eligible: true, atsMatch: 82 },
  { name: "Infosys", role: "Backend Engineer", eligible: true, atsMatch: 76 },
  { name: "Persistent Systems", role: "Full Stack Developer", eligible: false, atsMatch: 61 },
];

const APPLICATIONS = [
  { company: "TCS", role: "Java Developer", date: "18 Jul 2026", status: "Shortlisted" },
  { company: "Infosys", role: "Backend Engineer", date: "15 Jul 2026", status: "Under Review" },
  { company: "Wipro", role: "Software Engineer", date: "10 Jul 2026", status: "Applied" },
  { company: "Persistent Systems", role: "Full Stack Developer", date: "02 Jul 2026", status: "Rejected" },
  { company: "Nimbus Cloud", role: "Java Developer", date: "24 Jun 2026", status: "Selected" },
];

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "My Profile", icon: User },
  { key: "resume", label: "Resume & ATS Analysis", icon: FileText },
  { key: "career", label: "Career Recommendations", icon: Compass },
  { key: "skillgap", label: "Skill Gap & Roadmap", icon: Target },
  { key: "companies", label: "Recommended Companies", icon: Building2 },
  { key: "applications", label: "My Applications", icon: ClipboardList },
];

const STATUS_TONE = {
  Applied: "neutral",
  "Under Review": "amber",
  Shortlisted: "teal",
  Rejected: "coral",
  Selected: "teal",
};

/* ============================== PRIMITIVES ============================== */
function Card({ children, className = "", style = {}, padded = true }) {
  return (
    <div
      className={`rounded-2xl ${padded ? "p-5" : ""} ${className}`}
      style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, ...style }}
    >
      {children}
    </div>
  );
}

function Pill({ children, tone = "neutral" }) {
  const map = {
    neutral: { bg: C.paperDim, fg: C.inkSoft },
    amber: { bg: C.amberSoft, fg: C.amberDark },
    teal: { bg: C.tealSoft, fg: C.tealDark },
    coral: { bg: C.coralSoft, fg: C.coralDark },
  };
  const t = map[tone] || map.neutral;
  return (
    <span
      className="f-body text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap"
      style={{ backgroundColor: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "f-body text-sm font-medium px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-transform active:scale-[0.98]";
  const styles = {
    primary: { backgroundColor: C.ink, color: C.paper },
    accent: { backgroundColor: C.amber, color: "#2B1D04" },
    ghost: { backgroundColor: "transparent", color: C.ink, border: `1px solid ${C.line}` },
  };
  return (
    <button className={`${base} ${className}`} style={styles[variant]} {...props}>
      {children}
    </button>
  );
}

/* ============================== SIDEBAR ============================== */
function Sidebar({ active, setActive }) {
  return (
    <aside
      className="w-64 shrink-0 h-full flex-col p-5 hidden lg:flex"
      style={{ backgroundColor: C.ink }}
    >
      <div className="flex items-center gap-2 mb-8 px-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.amber }}>
          <Sparkles size={16} color="#2B1D04" />
        </div>
        <div>
          <div className="f-display text-sm font-semibold text-white leading-tight">GIT CareerAI</div>
          <div className="f-body text-[10px]" style={{ color: "#8FA096" }}>Career Intelligence</div>
        </div>
      </div>
      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className="f-body w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors"
              style={{
                backgroundColor: isActive ? "rgba(227,165,48,0.15)" : "transparent",
                color: isActive ? C.amber : "#C7D2CB",
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <button className="f-body flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm" style={{ color: "#8FA096" }}>
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}

/* ============================== TOP NAVBAR ============================== */
function TopNavbar() {
  return (
    <header
      className="h-16 shrink-0 flex items-center justify-between px-6"
      style={{ borderBottom: `1px solid ${C.line}`, backgroundColor: C.card }}
    >
      <div className="f-display text-sm font-semibold lg:hidden" style={{ color: C.ink }}>GIT CareerAI</div>
      <div className="hidden lg:block f-body text-sm" style={{ color: C.inkFaint }}>
        Final Year · Computer Engineering
      </div>
      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell size={19} style={{ color: C.inkSoft }} />
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: C.coral, border: `2px solid ${C.card}` }}
          />
        </button>
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center f-display text-sm font-semibold"
            style={{ backgroundColor: C.amberSoft, color: C.amberDark }}
          >
            {STUDENT.name[0]}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="f-body text-sm font-medium" style={{ color: C.ink }}>{STUDENT.fullName}</div>
            <div className="f-body text-xs" style={{ color: C.inkFaint }}>{STUDENT.branch}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================== SECTIONS ============================== */
function WelcomeSection() {
  return (
    <div className="mb-6">
      <h1 className="f-display text-2xl sm:text-3xl font-semibold" style={{ color: C.ink }}>
        Welcome back, {STUDENT.name}! 👋
      </h1>
      <p className="f-body text-sm mt-1" style={{ color: C.inkSoft }}>
        Let's improve your career readiness and find the right opportunities.
      </p>
    </div>
  );
}

function SummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {SUMMARY.map((s, i) => {
        const Icon = s.icon;
        const toneColor = s.tone === "amber" ? C.amber : s.tone === "coral" ? C.coral : C.teal;
        const toneSoft = s.tone === "amber" ? C.amberSoft : s.tone === "coral" ? C.coralSoft : C.tealSoft;
        return (
          <Card key={i}>
            <div className="flex items-center justify-between mb-3">
              <span className="f-body text-xs" style={{ color: C.inkFaint }}>{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: toneSoft }}>
                <Icon size={15} style={{ color: toneColor }} />
              </div>
            </div>
            <div
              className={`f-display font-semibold leading-tight ${s.value.length > 6 ? "text-base" : "text-2xl"}`}
              style={{ color: C.ink }}
            >
              {s.value}<span className="f-body text-sm font-normal" style={{ color: C.inkFaint }}>{s.suffix}</span>
            </div>
            <div className="f-body text-xs mt-1.5" style={{ color: toneColor }}>{s.note}</div>
          </Card>
        );
      })}
    </div>
  );
}

function ResumeAnalysisCard() {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="f-display text-lg font-semibold" style={{ color: C.ink }}>Resume Analysis</h3>
        <Pill tone="teal"><CheckCircle2 size={12} /> {RESUME_ANALYSIS.status}</Pill>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center f-mono text-lg font-semibold shrink-0"
            style={{ backgroundColor: C.amberSoft, color: C.amberDark, border: `3px solid ${C.amber}` }}
          >
            {RESUME_ANALYSIS.score}
          </div>
          <div>
            <div className="f-body text-sm" style={{ color: C.ink }}>ATS Score</div>
            <div className="f-body text-xs" style={{ color: C.inkFaint }}>out of 100</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="f-body text-xs" style={{ color: C.inkFaint }}>Last analyzed</div>
          <div className="f-body text-sm" style={{ color: C.inkSoft }}>{RESUME_ANALYSIS.lastAnalyzed}</div>
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
        <h3 className="f-display text-lg font-semibold" style={{ color: C.ink }}>Career Recommendations</h3>
        <Pill><Sparkles size={11} /> AI matched</Pill>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {CAREER_RECS.map((r, i) => (
          <div key={i} className="rounded-xl p-4 flex flex-col justify-between" style={{ border: `1px solid ${C.line}` }}>
            <div>
              <div className="f-body font-medium text-sm mb-2" style={{ color: C.ink }}>{r.role}</div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1.5 rounded-full flex-1" style={{ backgroundColor: C.paperDim }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${r.match}%`, backgroundColor: r.match >= 80 ? C.teal : r.match >= 70 ? C.amber : C.coral }}
                  />
                </div>
                <span className="f-mono text-xs font-medium" style={{ color: C.inkSoft }}>{r.match}%</span>
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
        <h3 className="f-display text-lg font-semibold" style={{ color: C.ink }}>Recommended Companies</h3>
        <Pill tone="teal"><TrendingUp size={11} /> Based on your profile</Pill>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {COMPANIES.map((c, i) => (
          <div key={i} className="rounded-xl p-4" style={{ border: `1px solid ${C.line}` }}>
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center f-display font-semibold text-sm"
                style={{ backgroundColor: C.paperDim, color: C.ink }}
              >
                {c.name[0]}
              </div>
              <Pill tone={c.atsMatch >= 80 ? "teal" : c.atsMatch >= 65 ? "amber" : "coral"}>{c.atsMatch}% ATS</Pill>
            </div>
            <div className="f-body font-medium text-sm mt-2" style={{ color: C.ink }}>{c.name}</div>
            <div className="f-body text-xs mb-2" style={{ color: C.inkFaint }}>{c.role}</div>
            <Pill tone={c.eligible ? "teal" : "coral"}>
              {c.eligible ? <CheckCircle2 size={11} /> : null} {c.eligible ? "Eligible" : "Not Eligible"}
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
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between p-5 pb-0 mb-1">
        <h3 className="f-display text-lg font-semibold" style={{ color: C.ink }}>Recent Applications</h3>
        <button className="f-body text-xs underline" style={{ color: C.inkFaint }}>View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left f-body text-xs" style={{ color: C.inkFaint }}>
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Job Role</th>
              <th className="px-5 py-3 font-medium">Applied Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {APPLICATIONS.map((a, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="px-5 py-3 f-body font-medium" style={{ color: C.ink }}>{a.company}</td>
                <td className="px-5 py-3 f-body" style={{ color: C.inkSoft }}>{a.role}</td>
                <td className="px-5 py-3 f-mono text-xs" style={{ color: C.inkSoft }}>{a.date}</td>
                <td className="px-5 py-3"><Pill tone={STATUS_TONE[a.status]}>{a.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-4" />
    </Card>
  );
}

/* ============================== MAIN APP ============================== */
export default function StudentDashboard() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="w-full min-h-screen flex f-body" style={{ backgroundColor: C.paper }}>
      <FontImport />
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <WelcomeSection />
            <SummaryCards />
            <ResumeAnalysisCard />
            <CareerRecommendations />
            <RecommendedCompanies />
            <RecentApplications />
          </div>
        </main>
      </div>
    </div>
  );
}
