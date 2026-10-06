import {
  LayoutDashboard,
  User,
  FileText,
  Compass,
  Target,
  Building2,
  ClipboardList,
  MapPin,
} from "lucide-react";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { key: "profile", label: "My Profile", icon: User, path: "/profile" },
  { key: "resume", label: "Resume & ATS Analysis", icon: FileText, path: "/resume" },
  { key: "career", label: "Career Recommendations", icon: Compass, path: "/career" },
  { key: "skillgap", label: "Skill Gap & Roadmap", icon: Target, path: "/skillgap" },
  { key: "companies", label: "Recommended Companies", icon: Building2, path: "/companies" },
  { key: "applications", label: "My Applications", icon: ClipboardList, path: "/applications" },
];

export const SUMMARY = [
  { label: "ATS Score", value: "78", suffix: "/100", tone: "amber", icon: FileText, note: "+4 since last scan" },
  { label: "Career Match", value: "Java Backend Developer", suffix: "", tone: "teal", icon: Compass, note: "85% alignment" },
  { label: "Skill Gap", value: "3", suffix: " Skills Missing", tone: "coral", icon: Target, note: "Spring Boot, SQL, AWS" },
  { label: "Roadmap Progress", value: "45", suffix: "%", tone: "teal", icon: MapPin, note: "Year 3 of 4" },
];

export const RESUME_ANALYSIS = {
  status: "Analyzed",
  score: 78,
  lastAnalyzed: "22 July 2026",
};

export const CAREER_RECS = [
  { role: "Java Backend Developer", match: 85 },
  { role: "Full Stack Developer", match: 75 },
  { role: "Software Engineer", match: 68 },
];

export const COMPANIES = [
  { name: "TCS", role: "Java Developer", eligible: true, atsMatch: 82 },
  { name: "Infosys", role: "Backend Engineer", eligible: true, atsMatch: 76 },
  { name: "Persistent Systems", role: "Full Stack Developer", eligible: false, atsMatch: 61 },
];

export const APPLICATIONS = [
  { company: "TCS", role: "Java Developer", date: "18 Jul 2026", status: "Shortlisted" },
  { company: "Infosys", role: "Backend Engineer", date: "15 Jul 2026", status: "Under Review" },
  { company: "Wipro", role: "Software Engineer", date: "10 Jul 2026", status: "Applied" },
  { company: "Persistent Systems", role: "Full Stack Developer", date: "02 Jul 2026", status: "Rejected" },
  { company: "Nimbus Cloud", role: "Java Developer", date: "24 Jun 2026", status: "Selected" },
];

export const STATUS_TONE = {
  Applied: "neutral",
  "Under Review": "amber",
  Shortlisted: "teal",
  "Interview Scheduled": "teal",
  "Technical Round": "teal",
  Selected: "teal",
  "Offer Extended": "teal",
  "Offer Accepted": "teal",
  Placed: "teal",
  Rejected: "coral",
};

export const BRANCHES = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
