import { useState, useEffect, useMemo } from "react";
import {
  Award,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Building2,
  IndianRupee,
  GraduationCap,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getPlacements,
  recordPlacement,
  subscribe,
} from "../../services/adminService.js";

export default function Placements() {
  const [placements, setPlacements] = useState(getPlacements());
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    studentName: "",
    rollNo: "",
    branch: "Computer Engineering",
    company: "Tata Consultancy Services (TCS)",
    role: "Full Stack Developer",
    ctc: "₹8.5 LPA",
    placementDate: "",
    offerType: "Full-Time",
  });

  useEffect(() => {
    const unsub = subscribe(() => {
      setPlacements(getPlacements());
    });
    return () => unsub();
  }, []);

  const filteredPlacements = useMemo(() => {
    return placements.filter((p) => {
      if (branchFilter !== "All" && p.branch !== branchFilter) return false;
      if (search) {
        const q = search.toLowerCase().trim();
        const match =
          p.studentName.toLowerCase().includes(q) ||
          p.rollNo.toLowerCase().includes(q) ||
          p.company.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [placements, search, branchFilter]);

  const isDuplicateForm = useMemo(() => {
    if (!form.rollNo && !form.studentName) return false;
    return placements.some((p) => {
      const matchRoll = form.rollNo && p.rollNo?.toLowerCase() === form.rollNo.trim().toLowerCase();
      const matchName = form.studentName && p.studentName?.toLowerCase() === form.studentName.trim().toLowerCase();
      const matchCompany = form.company && p.company?.toLowerCase() === form.company.trim().toLowerCase();
      const matchRole = form.role && p.role?.toLowerCase() === form.role.trim().toLowerCase();
      return (matchRoll || matchName) && matchCompany && matchRole;
    });
  }, [placements, form.rollNo, form.studentName, form.company, form.role]);

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    if (!form.studentName || !form.rollNo || !form.company || !form.ctc) {
      setToast("Please fill in candidate name, roll number, company, and package.");
      return;
    }

    const d = form.placementDate ? new Date(form.placementDate) : new Date();
    const dateLabel = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const res = recordPlacement({
      ...form,
      placementDate: dateLabel,
    });

    if (!res.success) {
      setToast(res.error || "This student already has a recorded placement for this company and role.");
      setTimeout(() => setToast(""), 4500);
      return;
    }

    setShowModal(false);
    setToast(`Placement confirmed for ${form.studentName} at ${form.company}!`);
    setTimeout(() => setToast(""), 3500);

    setForm({
      studentName: "",
      rollNo: "",
      branch: "Computer Engineering",
      company: "Tata Consultancy Services (TCS)",
      role: "Full Stack Developer",
      ctc: "₹8.5 LPA",
      placementDate: "",
      offerType: "Full-Time",
    });
  };

  const handleExportCSV = () => {
    const headers = "Student Name,Roll No,Branch,Company,Role,CTC,Date,Offer Type\n";
    const rows = filteredPlacements
      .map(
        (p) =>
          `"${p.studentName}","${p.rollNo}","${p.branch}","${p.company}","${p.role}","${p.ctc}","${p.placementDate}","${p.offerType}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GIT_Placement_Ledger_2026.csv";
    a.click();
    setToast("Placement Ledger exported as CSV successfully.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Placements Ledger
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Verified institutional repository of final campus placement offers, CTC packages, and student acceptances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="!py-2 !px-3 !text-xs"
            onClick={handleExportCSV}
          >
            <Download size={14} /> Export Report
          </Button>
          <Button
            variant="primary"
            className="!py-2 !px-3 !text-xs"
            onClick={() => setShowModal(true)}
          >
            <Plus size={14} /> Record Placement
          </Button>
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

      {/* KPI Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!p-4">
          <span className="text-xs font-body text-ink-faint">Total Offers Verified</span>
          <div className="font-mono text-2xl font-bold text-ink mt-1">
            {placements.length}
          </div>
        </Card>
        <Card className="!p-4">
          <span className="text-xs font-body text-ink-faint">Highest Package</span>
          <div className="font-mono text-2xl font-bold text-teal-dark mt-1">₹14.5 LPA</div>
        </Card>
        <Card className="!p-4">
          <span className="text-xs font-body text-ink-faint">Average Package</span>
          <div className="font-mono text-2xl font-bold text-ink mt-1">₹7.6 LPA</div>
        </Card>
        <Card className="!p-4">
          <span className="text-xs font-body text-ink-faint">Active Hirers</span>
          <div className="font-mono text-2xl font-bold text-ink mt-1">18 Companies</div>
        </Card>
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
              placeholder="Search by student, roll number, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
            />
          </div>

          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="All">All Engineering Branches</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Telecommunication">Electronics &amp; Telecom</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Placements Ledger Table */}
      <Card padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body text-xs">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-ink-soft">
                <th className="py-3 px-4 font-semibold">Student &amp; Roll No</th>
                <th className="py-3 px-4 font-semibold">Branch</th>
                <th className="py-3 px-4 font-semibold">Company</th>
                <th className="py-3 px-4 font-semibold">Designation / Role</th>
                <th className="py-3 px-4 font-semibold">Package (CTC)</th>
                <th className="py-3 px-4 font-semibold">Date Verified</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredPlacements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-ink-soft">
                    No confirmed placements match this search.
                  </td>
                </tr>
              ) : (
                filteredPlacements.map((plc) => (
                  <tr key={plc.id} className="hover:bg-paper-dim/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-sm text-ink">{plc.studentName}</div>
                      <div className="font-mono text-[11px] text-ink-faint">{plc.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-soft font-medium">{plc.branch}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink flex items-center gap-1.5">
                        <Building2 size={13} /> {plc.company}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-soft">{plc.role}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-ink text-sm">
                      {plc.ctc}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-ink-soft">{plc.placementDate}</td>
                    <td className="py-3.5 px-4">
                      <Pill tone="teal">{plc.status || "Offer Accepted"}</Pill>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Placement Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-card border border-line rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-line flex items-center justify-between bg-paper-dim">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-teal" />
                <span className="font-display text-sm font-semibold text-ink">
                  Record Confirmed Campus Placement Offer
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-line text-ink-soft hover:text-ink text-sm font-medium"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="p-6 overflow-y-auto space-y-4 font-body text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-ink mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Bilal Madre"
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 22CE1045"
                    value={form.rollNo}
                    onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Engineering Branch</label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                >
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Telecommunication">Electronics &amp; Telecom</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-ink mb-1">Recruiter / Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Tata Consultancy Services"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Designation / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Systems Engineer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-ink mb-1">CTC Package Offered</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ₹8.5 LPA"
                    value={form.ctc}
                    onChange={(e) => setForm({ ...form, ctc: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Offer Release Date</label>
                  {/* Real HTML date picker */}
                  <input
                    type="date"
                    value={form.placementDate}
                    onChange={(e) => setForm({ ...form, placementDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              {isDuplicateForm && (
                <div className="p-3 bg-coral-soft/60 border border-coral/30 rounded-xl text-coral-dark text-xs flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-coral" />
                  <span>
                    <strong>Already Recorded:</strong> This candidate already has a confirmed campus placement recorded for {form.company} ({form.role}).
                  </span>
                </div>
              )}

              <div className="p-4 border-t border-line flex justify-end gap-2 bg-paper-dim -mx-6 -mb-6 mt-4">
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isDuplicateForm}>
                  Commit to Ledger
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
