import { useState, useEffect } from "react";
import { Briefcase, ClipboardList, Users, UserCheck, Star } from "lucide-react";
import StatCard from "../ui/StatCard.jsx";
import { getCompanyStats, subscribe } from "../../services/companyService.js";

export default function CompanySummaryCards() {
  const [stats, setStats] = useState(getCompanyStats);

  useEffect(() => {
    return subscribe(() => {
      setStats(getCompanyStats());
    });
  }, []);

  const cardItems = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      note: "Total postings",
      tone: "teal",
      icon: Briefcase,
      actionLabel: "Manage",
      actionTo: "/company/jobs",
    },
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      note: "Accepting applications",
      tone: "amber",
      icon: ClipboardList,
      actionLabel: "View Active",
      actionTo: "/company/jobs",
    },
    {
      label: "Total Applicants",
      value: stats.totalApplicants,
      note: "Applications received",
      tone: "teal",
      icon: Users,
      actionLabel: "Review",
      actionTo: "/company/applicants",
    },
    {
      label: "Eligible Candidates",
      value: stats.eligibleCandidates,
      note: "Met criteria",
      tone: "teal",
      icon: UserCheck,
      actionLabel: "Screen",
      actionTo: "/company/applicants?eligibility=Eligible",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted,
      note: "In interview pipeline",
      tone: "amber",
      icon: Star,
      actionLabel: "View Pipeline",
      actionTo: "/company/shortlisted",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
      {cardItems.map((item, i) => (
        <StatCard key={i} {...item} />
      ))}
    </div>
  );
}
