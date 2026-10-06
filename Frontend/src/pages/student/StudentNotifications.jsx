import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Briefcase,
  FileText,
  Clock,
  ArrowRight,
  CheckCheck,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getStudentNotifications,
  markStudentNotificationRead,
  markAllStudentNotificationsRead,
  subscribe,
} from "../../services/studentService.js";

const CATEGORY_ICONS = {
  application: FileText,
  interview: Calendar,
  job: Briefcase,
  system: Bell,
};

export default function StudentNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(getStudentNotifications());
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsub = subscribe(() => {
      setNotifications(getStudentNotifications());
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
      markStudentNotificationRead(item.id);
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              Placement Notifications
            </h1>
            {unreadCount > 0 && (
              <Pill tone="amber">
                {unreadCount} new
              </Pill>
            )}
          </div>
          <p className="font-body text-sm text-ink-soft mt-1">
            Real-time updates regarding shortlisted status, scheduled interviews, and placement cell alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={markAllStudentNotificationsRead}
            className="!py-1.5 !px-3 !text-xs self-start sm:self-auto"
          >
            <CheckCheck size={14} /> Mark All as Read
          </Button>
        )}
      </div>

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
          onClick={() => setFilter("interview")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            filter === "interview"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Interviews
        </button>
        <button
          type="button"
          onClick={() => setFilter("application")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            filter === "application"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          Applications
        </button>
        <button
          type="button"
          onClick={() => setFilter("system")}
          className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-medium transition-colors ${
            filter === "system"
              ? "bg-ink text-paper"
              : "bg-card border border-line text-ink-soft hover:text-ink"
          }`}
        >
          System &amp; Cell Alerts
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="text-center py-12">
          <Bell size={36} className="mx-auto text-ink-faint mb-3" />
          <h3 className="font-display text-base font-semibold text-ink">No notifications available.</h3>
          <p className="font-body text-xs text-ink-soft mt-1">
            You don&apos;t have any notifications under &quot;{filter}&quot;.
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
                  !item.read ? "bg-card border-l-4 border-l-amber" : "bg-card/70"
                }`}
                onClick={() => handleNotificationClick(item)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      !item.read
                        ? "bg-amber-soft text-amber-dark"
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
                          <span className="w-2 h-2 rounded-full bg-amber shrink-0" />
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
    </div>
  );
}
