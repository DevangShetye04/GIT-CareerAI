import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  ShieldCheck,
  GraduationCap,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getAdminStudents,
  toggleStudentVerified,
  subscribe,
} from "../../services/adminService.js";

const STATUS_TONES = {
  Placed: "teal",
  "In Process": "amber",
  Unplaced: "neutral",
};

export default function StudentManagement() {
  const [students, setStudents] = useState(getAdminStudents());
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const unsub = subscribe(() => {
      setStudents(getAdminStudents());
    });
    return () => unsub();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (branchFilter !== "All" && s.branch !== branchFilter) return false;
      if (statusFilter !== "All" && s.placementStatus !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase().trim();
        const matches =
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [students, search, branchFilter, statusFilter]);

  const placedCount = filteredStudents.filter((s) => s.placementStatus === "Placed").length;
  const placementPercentage =
    filteredStudents.length > 0
      ? ((placedCount / filteredStudents.length) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Student Management
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Manage senior batch records, track individual interview progress, and verify academic eligibility credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Pill tone="teal" className="text-xs">
            {placedCount} / {filteredStudents.length} Placed ({placementPercentage}%)
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
              placeholder="Search by student name, roll number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="All">All Engineering Branches</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Telecommunication">
                Electronics &amp; Telecommunication
              </option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="All">All Placement Statuses</option>
              <option value="Placed">Placed</option>
              <option value="In Process">In Process</option>
              <option value="Unplaced">Unplaced</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body text-xs">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-ink-soft">
                <th className="py-3 px-4 font-semibold">Student Name &amp; Roll No</th>
                <th className="py-3 px-4 font-semibold">Branch &amp; Batch</th>
                <th className="py-3 px-4 font-semibold">CGPA</th>
                <th className="py-3 px-4 font-semibold">Backlogs</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Verification</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-ink-soft">
                    No students match the current criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-paper-dim/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-sm text-ink">{s.name}</div>
                      <div className="font-mono text-[11px] text-ink-faint">{s.rollNo} • {s.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-soft">
                      <div className="font-medium text-ink">{s.branch}</div>
                      <div className="text-[11px] font-mono">Batch {s.batch}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-ink text-sm">
                      {s.cgpa}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {s.backlogs === 0 ? (
                        <span className="text-teal font-medium">0 Clean</span>
                      ) : (
                        <span className="text-coral font-semibold">{s.backlogs} Active</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Pill tone={STATUS_TONES[s.placementStatus] || "neutral"}>
                        {s.placementStatus}
                      </Pill>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStudentVerified(s.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                          s.verified
                            ? "bg-teal-soft text-teal-dark hover:bg-teal-soft/80"
                            : "bg-paper-dim text-ink-soft hover:bg-line"
                        }`}
                        title="Click to toggle placement cell verification"
                      >
                        {s.verified ? (
                          <>
                            <CheckCircle2 size={12} /> Verified
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Unverified
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        className="!py-1 !px-2.5 !text-xs"
                        onClick={() => setSelectedStudent(s)}
                      >
                        <Eye size={13} /> View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Profile Drawer / Modal */}
      {selectedStudent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-card border border-line rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-line flex items-center justify-between bg-paper-dim">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-ink" />
                <span className="font-display text-sm font-semibold text-ink">
                  Candidate Placement Record
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg hover:bg-line text-ink-soft hover:text-ink text-sm font-medium"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-body text-xs text-ink">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">{selectedStudent.name}</h2>
                  <p className="font-mono text-ink-soft">{selectedStudent.rollNo} • Batch {selectedStudent.batch}</p>
                </div>
                <Pill tone={STATUS_TONES[selectedStudent.placementStatus] || "neutral"}>
                  {selectedStudent.placementStatus}
                </Pill>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line">
                <div className="p-2.5 rounded-xl bg-paper-dim/60">
                  <div className="text-ink-faint text-[11px]">Branch</div>
                  <div className="font-medium text-ink mt-0.5">{selectedStudent.branch}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-paper-dim/60">
                  <div className="text-ink-faint text-[11px]">Academic Record</div>
                  <div className="font-medium font-mono text-ink mt-0.5">
                    CGPA: {selectedStudent.cgpa} • {selectedStudent.backlogs} Backlogs
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-ink-soft">
                  <Mail size={14} />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-soft">
                  <Phone size={14} />
                  <span>{selectedStudent.phone || "+91 98234 56789"}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-line bg-paper-dim/40 space-y-2">
                <div className="flex justify-between font-body text-xs">
                  <span className="text-ink-soft">Campus Applications Submitted:</span>
                  <span className="font-mono font-semibold text-ink">{selectedStudent.appliedCount}</span>
                </div>
                <div className="flex justify-between font-body text-xs">
                  <span className="text-ink-soft">Placement Offers Received:</span>
                  <span className="font-mono font-semibold text-teal-dark">{selectedStudent.offersCount}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-line flex justify-end gap-2 bg-paper-dim">
              <Button variant="ghost" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
