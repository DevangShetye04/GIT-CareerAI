import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Briefcase,
  MapPin,
  IndianRupee,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import { getStudentJobs, subscribe } from "../../services/studentService.js";

export default function StudentJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(getStudentJobs());
  const [search, setSearch] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [eligibleOnly, setEligibleOnly] = useState(false);

  useEffect(() => {
    const unsub = subscribe(() => {
      setJobs(getStudentJobs());
    });
    return () => unsub();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title?.toLowerCase().includes(q) ||
        job.company?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        (job.skills || []).some((s) => s.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Work mode
      if (workModeFilter !== "all" && job.workMode?.toLowerCase() !== workModeFilter.toLowerCase()) {
        return false;
      }

      // Type
      if (typeFilter !== "all" && job.type?.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Eligible
      if (eligibleOnly && !job.isEligible) {
        return false;
      }

      return true;
    });
  }, [jobs, search, workModeFilter, typeFilter, eligibleOnly]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Campus Placement Openings
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Browse campus job postings from verified visiting recruiters. Apply directly with your placement resume.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="teal" className="text-xs">
            <CheckCircle2 size={12} /> Live Sync with Recruiters
          </Pill>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="!p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              placeholder="Search by role, company name, skill, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="all">All Work Modes</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="all">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
            </select>

            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink cursor-pointer select-none hover:bg-paper-dim">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
                className="rounded border-line text-ink focus:ring-0"
              />
              <span>Eligible Only</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <Briefcase size={36} className="mx-auto text-ink-faint mb-3" />
          <h3 className="font-display text-base font-semibold text-ink">No Job Postings Found</h3>
          <p className="font-body text-xs text-ink-soft max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search terms or filters to see more campus placement opportunities.
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setWorkModeFilter("all");
              setTypeFilter("all");
              setEligibleOnly(false);
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="flex flex-col justify-between hover:border-ink/40 transition-colors"
            >
              <div>
                {/* Top Row: Company & Eligibility */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-paper-dim border border-line flex items-center justify-center font-display font-bold text-base text-ink shrink-0">
                      {job.company?.[0] || "C"}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink leading-snug hover:underline cursor-pointer"
                          onClick={() => navigate(`/jobs/${job.id}`)}>
                        {job.title}
                      </h3>
                      <p className="font-body text-xs text-ink-soft flex items-center gap-1 mt-0.5">
                        <Building size={12} /> {job.company}
                      </p>
                    </div>
                  </div>

                  {job.isApplied ? (
                    <Pill tone="teal">
                      <CheckCircle2 size={11} /> Applied
                    </Pill>
                  ) : job.isEligible ? (
                    <Pill tone="teal">
                      <CheckCircle2 size={11} /> Eligible
                    </Pill>
                  ) : (
                    <Pill tone="coral">
                      <XCircle size={11} /> Not Eligible
                    </Pill>
                  )}
                </div>

                {/* Job Metadata Chips */}
                <div className="flex flex-wrap gap-2 text-xs font-body text-ink-soft my-3">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-paper-dim border border-line/50">
                    <MapPin size={11} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-paper-dim border border-line/50 font-mono">
                    <IndianRupee size={11} /> {job.ctc}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-paper-dim border border-line/50">
                    {job.workMode}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-paper-dim border border-line/50">
                    {job.type}
                  </span>
                </div>

                {/* Eligibility Criteria Hint */}
                <div className="text-[11px] font-body text-ink-soft bg-paper-dim/60 p-2.5 rounded-lg mb-3">
                  <span className="font-medium text-ink">Criteria:</span> Min CGPA {job.minCgpa || 7.0} • Max Backlogs {job.allowedBacklogs ?? 0}
                  {!job.isEligible && (
                    <span className="text-coral block mt-0.5">
                      Your CGPA / branch doesn&apos;t meet this recruiter&apos;s cutoff criteria.
                    </span>
                  )}
                </div>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(job.skills || []).slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-paper-dim text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                  {(job.skills || []).length > 4 && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-paper-dim text-ink-soft">
                      +{(job.skills || []).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-line flex items-center justify-between gap-3">
                <div className="text-[11px] font-body text-ink-faint flex items-center gap-1">
                  <Clock size={11} /> Application Deadline: {job.deadline || "Open"}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="!py-1.5 !px-3 !text-xs"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View Details <ChevronRight size={13} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
