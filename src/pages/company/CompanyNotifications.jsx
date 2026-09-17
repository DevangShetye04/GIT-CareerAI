import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Check,
  Briefcase,
  UserPlus,
  Star,
  Clock,
  ExternalLink,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Pill from "../../components/ui/Pill.jsx";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  subscribe,
} from "../../services/companyService.js";

const CATEGORY_ICONS = {
  application: UserPlus,
  shortlist: Star,
  deadline: Clock,
  job: Briefcase,
  system: Bell,
};

const CATEGORY_COLORS = {
  application: "bg-teal-soft text-teal",
  shortlist: "bg-amber-soft text-amber",
  deadline: "bg-coral-soft text-coral",
  job: "bg-paper-dim text-ink",
  system: "bg-paper-dim text-ink-soft",
};

export default function CompanyNotifications() {
  const [notifications, setNotifications] = useState(getNotifications);
  const [filterType, setFilterType] = useState("all"); // 'all' | 'unread'

  useEffect(() => {
    return subscribe(() => {
      setNotifications(getNotifications());
    });
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filterType === "unread") {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [notifications, filterType]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              Notifications & Alerts
            </h1>
            {unreadCount > 0 && (
              <Pill tone="amber">
                {unreadCount} unread
              </Pill>
            )}
          </div>
          <p className="font-body text-sm mt-1 text-ink-soft">
            Stay informed on incoming candidate applications, approaching job deadlines, and pipeline updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={() => markAllNotificationsRead()}
            className="!py-2 !text-xs self-start sm:self-auto"
          >
            <CheckCheck size={15} /> Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-paper-dim rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`font-body text-xs sm:text-sm font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
            filterType === "all"
              ? "bg-card text-ink shadow-sm border border-line"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          All Activity
          <span className="font-mono text-xs px-1.5 py-0.2 bg-paper-dim rounded-full text-ink">
            {notifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType("unread")}
          className={`font-body text-xs sm:text-sm font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
            filterType === "unread"
              ? "bg-card text-ink shadow-sm border border-line"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Unread Only
          {unreadCount > 0 && (
            <span className="font-mono text-xs px-1.5 py-0.2 bg-amber-soft text-amber-dark rounded-full font-semibold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <Card padded={false} className="divide-y divide-line overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={36} className="mx-auto text-ink-faint mb-3 opacity-60" />
            <h3 className="font-display text-base font-semibold text-ink">
              {filterType === "unread" ? "No unread notifications" : "No notifications available."}
            </h3>
            <p className="font-body text-sm text-ink-soft mt-1">
              {filterType === "unread"
                ? "You are all caught up! New applicant activities will show up here."
                : "Activity updates regarding applications and openings will be logged here."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const Icon = CATEGORY_ICONS[item.category] || Bell;
            const iconColor = CATEGORY_COLORS[item.category] || "bg-paper-dim text-ink";

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                  !item.read ? "bg-amber-soft/20" : "hover:bg-paper/30"
                }`}
              >
                {/* Category Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
                >
                  <Icon size={18} />
                </div>

                {/* Notification Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3
                      className={`font-body text-sm leading-snug ${
                        !item.read ? "font-semibold text-ink" : "font-medium text-ink"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="font-body text-xs text-ink-faint shrink-0 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>

                  {item.description && (
                    <p className="font-body text-xs text-ink-soft mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-2.5 flex items-center gap-3">
                    {item.link && (
                      <Link
                        to={item.link}
                        onClick={() => markNotificationRead(item.id)}
                        className="font-body text-xs text-teal font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Inspect Details <ExternalLink size={12} />
                      </Link>
                    )}

                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(item.id)}
                        className="font-body text-xs text-ink-faint hover:text-ink inline-flex items-center gap-1"
                      >
                        <Check size={13} /> Mark as read
                      </button>
                    )}
                  </div>
                </div>

                {/* Unread indicator dot */}
                {!item.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber shrink-0 mt-1.5" />
                )}
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}
