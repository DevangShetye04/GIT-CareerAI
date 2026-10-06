import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  Plus,
  Layers,
  Sparkles,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getPlacementDrives,
  createPlacementDrive,
  closePlacementDrive,
  subscribe,
} from "../../services/adminService.js";
import { useAuth } from "../../context/AuthContext.jsx";

const STATUS_TONES = {
  Scheduled: "amber",
  "In Progress": "teal",
  Completed: "neutral",
};

export default function PlacementDrives() {
  const { user } = useAuth();
  const defaultCoordinator = user?.name || user?.fullName || "Placement Cell Coordinator";
  const [drives, setDrives] = useState(getPlacementDrives());
  const [filter, setFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    driveName: "",
    company: "",
    date: "",
    time: "09:30 AM",
    venue: "Main Auditorium & Lab Complex",
    eligibleBranches: ["Computer Engineering", "Information Technology"],
    minCgpa: "7.0",
    rounds: "Online Test + 2 Technical Rounds + HR",
    coordinator: defaultCoordinator,
  });

  useEffect(() => {
    const unsub = subscribe(() => {
      setDrives(getPlacementDrives());
    });
    return () => unsub();
  }, []);

  const handleBranchToggle = (branch) => {
    setForm((prev) => {
      const current = prev.eligibleBranches || [];
      const updated = current.includes(branch)
        ? current.filter((b) => b !== branch)
        : [...current, branch];
      return { ...prev, eligibleBranches: updated };
    });
  };

  const handleCreateDrive = (e) => {
    e.preventDefault();
    if (!form.driveName || !form.company || !form.date) {
      setToast("Please provide drive name, company, and event date.");
      return;
    }

    const d = new Date(form.date);
    const dateLabel = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    createPlacementDrive({
      ...form,
      dateLabel,
      minCgpa: Number(form.minCgpa),
    });

    setShowCreateModal(false);
    setToast(`Placement drive "${form.driveName}" scheduled successfully!`);
    setTimeout(() => setToast(""), 3500);

    // Reset form
    setForm({
      driveName: "",
      company: "",
      date: "",
      time: "09:30 AM",
      venue: "Main Auditorium & Lab Complex",
      eligibleBranches: ["Computer Engineering", "Information Technology"],
      minCgpa: "7.0",
      rounds: "Online Test + 2 Technical Rounds + HR",
      coordinator: defaultCoordinator,
    });
  };

  const handleClose = (id) => {
    closePlacementDrive(id);
    setToast(`Drive #${id} marked as Completed.`);
    setTimeout(() => setToast(""), 3000);
  };

  const filteredDrives =
    filter === "All" ? drives : drives.filter((d) => d.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Placement Drives
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Organize recruitment dates, room allocations, online lab testing, and coordinate student batches.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto"
        >
          <Plus size={16} /> Schedule Drive
        </Button>
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-2">
        {["All", "Scheduled", "In Progress", "Completed"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
              filter === st
                ? "bg-ink text-paper"
                : "bg-card border border-line text-ink-soft hover:text-ink"
            }`}
          >
            {st} ({st === "All" ? drives.length : drives.filter((d) => d.status === st).length})
          </button>
        ))}
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrives.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Calendar size={36} className="mx-auto text-ink-faint mb-3" />
            <p className="font-display text-base font-semibold text-ink">
              No Placement Drives Found under &quot;{filter}&quot;
            </p>
          </div>
        ) : (
          filteredDrives.map((drv) => (
            <Card key={drv.id} className="flex flex-col justify-between hover:border-ink/30 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink leading-snug">
                      {drv.driveName}
                    </h3>
                    <p className="font-body text-xs text-ink-soft flex items-center gap-1.5 mt-0.5 font-medium">
                      <Building2 size={13} /> {drv.company}
                    </p>
                  </div>
                  <Pill tone={STATUS_TONES[drv.status] || "neutral"}>{drv.status}</Pill>
                </div>

                <div className="space-y-1.5 text-xs font-body text-ink my-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-ink-soft" />
                    <span className="font-mono font-medium">{drv.dateLabel || drv.date}</span>
                    <span className="text-ink-soft">•</span>
                    <Clock size={13} className="text-ink-soft" />
                    <span className="font-mono">{drv.time || "09:00 AM"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-soft">
                    <MapPin size={13} />
                    <span>{drv.venue || "Campus Auditorium"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Layers size={13} />
                    <span>{drv.rounds || "Aptitude + Technical + HR"}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-paper-dim/60 text-xs font-body space-y-1 my-3">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Minimum CGPA:</span>
                    <span className="font-mono font-medium text-ink">&gt;= {drv.minCgpa || 7.0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Registered Students:</span>
                    <span className="font-mono font-medium text-teal-dark">
                      {drv.applicantsCount || 0} Candidates
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                <span className="font-body text-[11px] text-ink-faint">
                  Coordinator: {drv.coordinator || "T&P Lead"}
                </span>

                {drv.status === "Scheduled" && (
                  <Button
                    variant="ghost"
                    className="!py-1 !px-2.5 !text-xs"
                    onClick={() => handleClose(drv.id)}
                  >
                    Mark Completed
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Schedule Drive Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-card border border-line rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-line flex items-center justify-between bg-paper-dim">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-ink" />
                <span className="font-display text-sm font-semibold text-ink">
                  Schedule New Campus Recruitment Drive
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-line text-ink-soft hover:text-ink text-sm font-medium"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="p-6 overflow-y-auto space-y-4 font-body text-xs">
              <div>
                <label className="block font-medium text-ink mb-1">Drive Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Infosys Special Campus Drive 2026"
                  value={form.driveName}
                  onChange={(e) => setForm({ ...form, driveName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-ink mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Infosys Limited"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Event Date</label>
                  {/* Real HTML date picker - meets strict UX requirement */}
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-ink mb-1">Reporting Time</label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Minimum CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5.0"
                    max="10.0"
                    value={form.minCgpa}
                    onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Campus Venue / Lab Locations</label>
                <input
                  type="text"
                  placeholder="e.g., Central Auditorium & Computer Labs 1-4"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Selection Rounds Structure</label>
                <input
                  type="text"
                  placeholder="e.g., Online Coding + Tech Interview + HR Discussion"
                  value={form.rounds}
                  onChange={(e) => setForm({ ...form, rounds: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-2">Eligible Engineering Branches</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Computer Engineering",
                    "Information Technology",
                    "Electronics & Telecommunication",
                    "Mechanical Engineering",
                  ].map((branch) => {
                    const isChecked = (form.eligibleBranches || []).includes(branch);
                    return (
                      <label
                        key={branch}
                        className="flex items-center gap-2 p-2 rounded-lg border border-line/60 bg-paper-dim/40 hover:bg-paper-dim cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBranchToggle(branch)}
                          className="rounded text-ink focus:ring-0"
                        />
                        <span className="text-[11px] font-medium text-ink truncate">{branch}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border-t border-line flex justify-end gap-2 bg-paper-dim -mx-6 -mb-6 mt-4">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Publish Drive Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
