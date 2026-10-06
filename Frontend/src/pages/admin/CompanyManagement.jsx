import { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Award,
  ExternalLink,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getAdminCompanies,
  toggleCompanyStatus,
  subscribe,
} from "../../services/adminService.js";

const STATUS_TONES = {
  Active: "teal",
  Verified: "teal",
  Pending: "amber",
  "Pending Verification": "amber",
  "On Hold": "coral",
  Rejected: "coral",
};

export default function CompanyManagement() {
  const [companies, setCompanies] = useState(getAdminCompanies());
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const unsub = subscribe(() => {
      setCompanies(getAdminCompanies());
    });
    return () => unsub();
  }, []);

  const availableIndustries = useMemo(() => {
    return ["All", ...Array.from(new Set(companies.map((c) => c.industry).filter(Boolean)))];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (industryFilter !== "All" && c.industry !== industryFilter) return false;
      if (statusFilter !== "All") {
        if (statusFilter === "Active") {
          if (c.status !== "Active" && c.status !== "Verified") return false;
        } else if (statusFilter === "Pending Verification") {
          if (c.status !== "Pending Verification") return false;
        } else if (c.status !== statusFilter) {
          return false;
        }
      }
      if (search) {
        const q = search.toLowerCase().trim();
        const matches =
          c.name.toLowerCase().includes(q) ||
          c.spoc.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [companies, search, industryFilter, statusFilter]);

  const handleStatusChange = (id, newStatus) => {
    toggleCompanyStatus(id, newStatus);
    setToast(`Company partnership status updated to "${newStatus}".`);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Partner Companies
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Corporate campus relations, HR contacts, active visiting recruiters, and MOU partnership agreements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Pill tone="teal" className="text-xs">
            {companies.filter((c) => c.status === "Active" || c.status === "Verified").length} Active Hirers
          </Pill>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-teal-soft text-teal-dark border border-teal/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={18} />
            <span>{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast("")}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

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
              placeholder="Search by company name, HR lead, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              {availableIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === "All" ? "All Industry Domains" : ind}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="All">All Partnership Statuses</option>
              <option value="Active">Active / Verified Hirers</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Pending">Pending MOU</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Building2 size={36} className="mx-auto text-ink-faint mb-3" />
            <p className="font-display text-base font-semibold text-ink">No Companies Found</p>
            <p className="font-body text-xs text-ink-soft mt-1">
              Try adjusting your search criteria or industry filter.
            </p>
          </div>
        ) : (
          filteredCompanies.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between hover:border-ink/30 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-paper-dim border border-line flex items-center justify-center font-display font-bold text-lg text-ink shrink-0">
                      {c.name[0]}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink">{c.name}</h3>
                      <p className="font-body text-xs text-ink-soft flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {c.location} • {c.industry}
                      </p>
                    </div>
                  </div>

                  <Pill tone={STATUS_TONES[c.status] || "neutral"}>{c.status}</Pill>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-body p-3 rounded-xl bg-paper-dim/50 my-3">
                  <div>
                    <div className="text-ink-faint text-[11px]">Active Openings</div>
                    <div className="font-mono font-semibold text-ink mt-0.5">
                      {c.openingsCount} Positions
                    </div>
                  </div>
                  <div>
                    <div className="text-ink-faint text-[11px]">Offers Released</div>
                    <div className="font-mono font-semibold text-teal-dark mt-0.5">
                      {c.offersReleased} Placed
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-body text-ink-soft mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">Recruiter SPOC:</span>
                    <span>{c.spoc} ({c.spocRole || "Campus Lead"})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} />
                    <span className="font-mono text-ink-soft">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} />
                    <span className="font-mono text-ink-soft">{c.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                <span className="font-body text-[11px] text-ink-faint">
                  MOU Valid: 2026-2027
                </span>

                <div className="flex items-center gap-2">
                  {c.status === "Pending Verification" && (
                    <>
                      <Button
                        variant="primary"
                        className="!py-1 !px-2.5 !text-xs"
                        onClick={() => handleStatusChange(c.id, "Verified")}
                      >
                        <CheckCircle2 size={12} /> Verify Recruiter
                      </Button>
                      <Button
                        variant="ghost"
                        className="!py-1 !px-2.5 !text-xs !text-coral hover:!bg-coral-soft"
                        onClick={() => handleStatusChange(c.id, "Rejected")}
                      >
                        Reject Recruiter
                      </Button>
                    </>
                  )}
                  {c.status !== "Active" &&
                    c.status !== "Verified" &&
                    c.status !== "Pending Verification" && (
                      <Button
                        variant="primary"
                        className="!py-1 !px-2.5 !text-xs"
                        onClick={() => handleStatusChange(c.id, "Active")}
                      >
                        <CheckCircle2 size={12} /> Set Active
                      </Button>
                    )}
                  {(c.status === "Active" || c.status === "Verified") && (
                    <Button
                      variant="ghost"
                      className="!py-1 !px-2.5 !text-xs !text-coral hover:!bg-coral-soft"
                      onClick={() => handleStatusChange(c.id, "On Hold")}
                    >
                      Put On Hold
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
