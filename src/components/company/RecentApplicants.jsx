import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Pill from "../ui/Pill.jsx";
import Button from "../ui/Button.jsx";
import { getApplicants, subscribe } from "../../services/companyService.js";
import { APPLICANT_STATUS_TONE } from "../../data/companyMockData.js";

export default function RecentApplicants() {
  const [applicants, setApplicants] = useState(getApplicants);

  useEffect(() => {
    return subscribe(() => {
      setApplicants(getApplicants());
    });
  }, []);

  const displayList = applicants.slice(0, 5);

  return (
    <Card padded={false} className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 pb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">Recent Applicants</h3>
          <p className="font-body text-xs text-ink-faint">
            Latest candidate submissions across active recruitment drives.
          </p>
        </div>
        <Link to="/company/applicants">
          <Button variant="ghost" className="!py-2 !text-xs w-full sm:w-auto justify-center">
            View All Applicants
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left font-body text-xs text-ink-faint border-t border-line">
              <th className="px-5 py-3 font-medium">Candidate Name</th>
              <th className="px-5 py-3 font-medium">Job Role</th>
              <th className="px-5 py-3 font-medium text-center">CGPA</th>
              <th className="px-5 py-3 font-medium text-center">ATS Score</th>
              <th className="px-5 py-3 font-medium">Eligibility</th>
              <th className="px-5 py-3 font-medium">Application Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayList.map((a) => (
              <tr key={a.id} className="border-t border-line hover:bg-paper/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="font-body font-medium text-ink">{a.name}</div>
                  <div className="font-body text-xs text-ink-faint">{a.branch}</div>
                </td>
                <td className="px-5 py-3.5 font-body text-ink-soft">{a.role}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-center text-ink-soft">{a.cgpa}</td>
                <td className="px-5 py-3.5 text-center">
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                      a.atsScore >= 85
                        ? "bg-teal-soft text-teal-dark"
                        : a.atsScore >= 75
                        ? "bg-amber-soft text-amber-dark"
                        : "bg-coral-soft text-coral-dark"
                    }`}
                  >
                    {a.atsScore}%
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <Pill tone={a.eligible ? "teal" : "coral"}>
                    {a.eligible ? "Eligible" : "Not Eligible"}
                  </Pill>
                </td>
                <td className="px-5 py-3.5">
                  <Pill tone={APPLICANT_STATUS_TONE[a.status] || "neutral"}>{a.status}</Pill>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    to={`/company/applicants/${a.id}`}
                    className="font-body text-xs text-teal font-medium hover:underline whitespace-nowrap"
                  >
                    View Candidate →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-2" />
    </Card>
  );
}
