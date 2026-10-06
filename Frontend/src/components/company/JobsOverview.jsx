import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Pill from "../ui/Pill.jsx";
import Button from "../ui/Button.jsx";
import { getJobs, subscribe } from "../../services/companyService.js";
import { JOB_STATUS_TONE } from "../../data/companyMockData.js";

function getDaysRemaining(deadlineStr) {
  if (!deadlineStr) return null;
  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) return null;
  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays} days remaining`;
  if (diffDays === 0) return "Ends today";
  return "Expired";
}

export default function JobsOverview() {
  const [jobs, setJobs] = useState(getJobs);

  useEffect(() => {
    return subscribe(() => {
      setJobs(getJobs());
    });
  }, []);

  const displayJobs = jobs.slice(0, 4);

  return (
    <Card padded={false} className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 pb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">Your Jobs</h3>
          <p className="font-body text-xs text-ink-faint">
            Overview of recently posted recruitment drives and openings.
          </p>
        </div>
        <Link to="/company/jobs">
          <Button variant="ghost" className="!py-2 !text-xs w-full sm:w-auto justify-center">
            View All Jobs
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left font-body text-xs text-ink-faint border-t border-line">
              <th className="px-5 py-3 font-medium">Job Title</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium text-center">Applicants</th>
              <th className="px-5 py-3 font-medium text-center">Eligible Candidates</th>
              <th className="px-5 py-3 font-medium">Deadline</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayJobs.map((job) => {
              const daysRemaining = job.status === "Active" ? getDaysRemaining(job.deadline) : null;
              return (
                <tr key={job.id} className="border-t border-line hover:bg-paper/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-body font-medium text-ink">{job.title}</div>
                    <div className="font-body text-xs text-ink-faint">{job.jobType} · {job.workMode}</div>
                  </td>
                  <td className="px-5 py-3.5 font-body text-ink-soft">{job.location}</td>
                  <td className="px-5 py-3.5 font-mono text-center text-ink-soft">{job.applicants}</td>
                  <td className="px-5 py-3.5 font-mono text-center text-teal-dark font-medium">
                    {job.eligibleCandidates}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-body text-xs text-ink-soft">{job.deadlineLabel || job.deadline}</div>
                    {daysRemaining && (
                      <span className="font-body text-[11px] text-amber-dark font-medium block">
                        {daysRemaining}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <Pill tone={JOB_STATUS_TONE[job.status] || "neutral"}>{job.status}</Pill>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        to={`/company/jobs/${job.id}`}
                        className="font-body text-xs text-teal hover:underline font-medium"
                      >
                        View
                      </Link>
                      <Link
                        to={`/company/jobs/${job.id}?edit=true`}
                        className="font-body text-xs text-ink-soft hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/company/applicants?job=${encodeURIComponent(job.title)}`}
                        className="font-body text-xs text-teal hover:underline font-medium whitespace-nowrap"
                      >
                        Manage Applicants
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="h-2" />
    </Card>
  );
}
