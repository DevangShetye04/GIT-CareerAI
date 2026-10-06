import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Award,
  Building2,
  CheckSquare,
  ArrowRight,
  CheckCheck,
  Send,
  Radio,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  addAdminNotification,
  subscribe,
} from "../../services/adminService.js";
import { addStudentNotification } from "../../services/studentService.js";

const CATEGORY_ICONS = {
  approval: CheckSquare,
  drive: Calendar,
  placement: Award,
  company: Building2,
};

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(getAdminNotifications());
  const [filter, setFilter] = useState("all");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [toast, setToast] = useState("");

  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    targetAudience: "All Students",
    category: "drive",
  });

  useEffect(() => {
    const unsub = subscribe(() => {
      setNotifications(getAdminNotifications());
    });
    return () => unsub();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter !== "all") return n.category === filter;
    return true;
  });

  const handleNotificationClick = (item) => {
    if (!item.read) {
      markAdminNotificationRead(item.id);
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) {
      setToast("Please fill in announcement title and message.");
      return;
    }

    // Add to admin notifications
    addAdminNotification({
      title: `Broadcast: ${broadcastForm.title}`,
      message: broadcastForm.message,
      category: broadcastForm.category,
      link: "/admin/notifications",
    });

    // Also broadcast to student notifications! (Single source of truth communication)
    try {
      addStudentNotification({
        title: `Placement Cell Notice: ${broadcastForm.title}`,
        message: broadcastForm.message,
        category: "system",
        link: "/notifications",
      });
    } catch {
      // Ignore if student service isolated
    }

    setShowBroadcastModal(false);
    setToast("Campus-wide announcement broadcasted successfully!");
    setTimeout(() => setToast(""), 3500);

    setBroadcastForm({
      title: "",
      message: "",
      targetAudience: "All Students",
      category: "drive",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              Placement Cell Alerts &amp; Announcements
            </h1>
            {unreadCount > 0 && (
              <Pill tone="amber">
                {unreadCount} new
              </Pill>
            )}
          </div>
          <p className="font-body text-sm text-ink-soft mt-1">
            Institutional alerts on recruiter approvals, drive milestones, student offers, and campus-wide bulletins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              onClick={markAllAdminNotificationsRead}
              className="!py-1.5 !px-3 !text-xs"
            >
              <CheckCheck size={14} /> Mark All as Read
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => setShowBroadcastModal(true)}
            className="!py-1.5 !px-3 !text-xs"
          >
            <Radio size={14} /> Broadcast Announcement
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            filter === "unread"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("approval")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            filter === "approval"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Job Approvals
        </button>
        <button
          type="button"
          onClick={() => setFilter("drive")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            filter === "drive"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Drives
        </button>
        <button
          type="button"
          onClick={() => setFilter("placement")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            filter === "placement"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Placements
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="text-center py-12">
          <Bell size={36} className="mx-auto text-ink-faint mb-3" />
          <h3 className="font-display text-base font-semibold text-ink">No notifications available.</h3>
          <p className="font-body text-xs text-ink-soft mt-1">
            No placement cell notifications under &quot;{filter}&quot;.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const IconComponent = CATEGORY_ICONS[item.category] || Bell;
            return (
              <Card
                key={item.id}
                className={`transition-all hover:border-ink/40 cursor-pointer ${
                  !item.read ? "bg-card border-l-4 border-l-teal" : "bg-card/70"
                }`}
                onClick={() => handleNotificationClick(item)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      !item.read
                        ? "bg-teal-soft text-teal-dark"
                        : "bg-paper-dim text-ink-soft"
                    }`}
                  >
                    <IconComponent size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-display text-sm ${
                            !item.read ? "font-bold text-ink" : "font-semibold text-ink-soft"
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-ink-faint whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="font-body text-xs text-ink-soft mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-line/60">
                      <span className="font-body text-[11px] text-ink-faint capitalize">
                        Category: {item.category}
                      </span>
                      {item.link && (
                        <span className="font-body text-xs font-medium text-ink flex items-center gap-1 hover:underline">
                          View details <ArrowRight size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-card border border-line rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Radio size={18} className="text-teal" />
                <h3 className="font-display text-base font-semibold text-ink">
                  Broadcast Campus Placement Notice
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="text-xs text-ink-soft hover:text-ink font-medium"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3 font-body text-xs">
              <div>
                <label className="block font-medium text-ink mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Important: Pre-Placement Talk Mandatory Attendance"
                  value={broadcastForm.title}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Announcement Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete instructions for students or recruiters..."
                  value={broadcastForm.message}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, message: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-ink mb-1">Target Audience</label>
                  <select
                    value={broadcastForm.targetAudience}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, targetAudience: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  >
                    <option value="All Students">All Final Year Students</option>
                    <option value="Computer & IT">Computer &amp; IT Branches</option>
                    <option value="Registered Recruiters">Visiting Recruiters</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Category</label>
                  <select
                    value={broadcastForm.category}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  >
                    <option value="drive">Placement Drive</option>
                    <option value="approval">Policy &amp; Guidelines</option>
                    <option value="placement">General Notice</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <Button variant="ghost" onClick={() => setShowBroadcastModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <Send size={14} /> Send Broadcast
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
