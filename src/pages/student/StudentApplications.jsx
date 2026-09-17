import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Video,
  Briefcase,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import { getStudentApplications, subscribe } from "../../services/studentService.js";

const STATUS_TONES = {
  Applied: "amber",
  Shortlisted: "teal",
  "Interview Scheduled": "teal",
  "Technical Round": "teal",
  Selected: "teal",
  "Offer Extended": "teal",
  "Offer Accepted": "teal",
  Rejected: "coral",
};

export default function StudentApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(getStudentApplications());
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const unsub = subscribe(() => {
      setApplications(getStudentApplications());
    });
    return () => unsub();
  }, []);

  const counts = useMemo(() => {
    return {
      all: applications.length,
      applied: applications.filter((a) => a.status === "Applied").length,
      shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
      interviews: applications.filter(
        (a) => a.status === "Interview Scheduled" || a.status === "Technical Round"
      ).length,
      selected: applications.filter(
        (a) =>
          a.status === "Selected" ||
          a.status === "Offer Extended" ||
          a.status === "Offer Accepted"
      ).length,
    };
  }, [applications]);

  const filteredApps = useMemo(() => {
    if (statusFilter === "all") return applications;
    if (statusFilter === "applied") return applications.filter((a) => a.status === "Applied");
    if (statusFilter === "shortlisted")
      return applications.filter((a) => a.status === "Shortlisted");
    if (statusFilter === "interviews")
      return applications.filter(
        (a) => a.status === "Interview Scheduled" || a.status === "Technical Round"
      );
    if (statusFilter === "selected")
      return applications.filter(
        (a) =>
          a.status === "Selected" ||
          a.status === "Offer Extended" ||
          a.status === "Offer Accepted"
      );
    return applications;
  }, [applications, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            My Applications
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Track the status of your campus placement applications across visiting recruiters.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate("/jobs")}>
          <Briefcase size={15} /> Browse More Jobs
        </Button>
      </div>

      {/* Tabs / Filter Bar */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-2">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          All Applications ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("applied")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            statusFilter === "applied"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Applied ({counts.applied})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("shortlisted")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            statusFilter === "shortlisted"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Shortlisted ({counts.shortlisted})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("interviews")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            statusFilter === "interviews"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Interviews ({counts.interviews})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("selected")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            statusFilter === "selected"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Selected / Offers ({counts.selected})
        </button>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <Card className="text-center py-12">
          <FileText size={36} className="mx-auto text-ink-faint mb-3" />
          <h3 className="font-display text-base font-semibold text-ink">
            No applications found.
          </h3>
          <p className="font-body text-xs text-ink-soft max-w-sm mx-auto mt-1 mb-4">
            {statusFilter === "all"
              ? "You haven't submitted any applications yet."
              : `No applications found matching the "${statusFilter}" filter.`}
          </p>
          <Button variant="ghost" onClick={() => setStatusFilter("all")}>
            View All Applications
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <Card key={app.id} className="hover:border-ink/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-paper-dim border border-line flex items-center justify-center font-display font-bold text-lg text-ink shrink-0">
                    {app.company?.[0] || "C"}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold text-ink">
                        {app.role}
                      </h3>
                      <Pill tone={STATUS_TONES[app.status] || "neutral"}>
                        {app.status}
                      </Pill>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-body text-ink-soft mt-1">
                      <span className="flex items-center gap-1 font-medium text-ink">
                        <Building size={12} /> {app.company}
                      </span>
                      <span>•</span>
                      <span>{app.location || "Multiple Locations"}</span>
                      <span>•</span>
                      <span className="font-mono text-ink">{app.ctc || "Competitive"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-body text-ink-faint mt-2">
                      <Calendar size={12} /> Applied on{" "}
                      <span className="font-mono text-ink-soft">{app.appliedDateLabel || app.appliedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Interview highlight or View Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {app.interviewDate && (
                    <div className="p-2.5 rounded-xl bg-teal-soft/50 border border-teal/20 text-xs">
                      <div className="font-medium text-teal-dark flex items-center gap-1.5">
                        <Video size={13} /> {app.interviewRound || "Interview Round"}
                      </div>
                      <div className="font-mono text-[11px] text-ink-soft mt-0.5">
                        {app.interviewDateLabel} ({app.interviewMode || "Online"})
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {app.interviewDate && (
                      <Button
                        variant="accent"
                        className="!py-1.5 !px-3 !text-xs"
                        onClick={() => navigate("/interviews")}
                      >
                        Interview Hub
                      </Button>
                    )}
                    {app.jobId && (
                      <Button
                        variant="ghost"
                        className="!py-1.5 !px-3 !text-xs"
                        onClick={() => navigate(`/jobs/${app.jobId}`)}
                      >
                        View Job <ArrowRight size={13} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
