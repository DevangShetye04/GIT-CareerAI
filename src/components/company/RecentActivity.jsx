import { useState, useEffect } from "react";
import {
  UserPlus,
  UserCheck,
  Users,
  FileText,
  Settings,
  Calendar,
  Award,
  Briefcase,
  ClipboardList,
} from "lucide-react";
import Card from "../ui/Card.jsx";
import { getActivities, subscribe } from "../../services/companyService.js";

const ICON_MAP = {
  UserPlus,
  UserCheck,
  Users,
  FileText,
  Settings,
  Calendar,
  Award,
  Briefcase,
  ClipboardList,
};

export default function RecentActivity() {
  const [activities, setActivities] = useState(getActivities);

  useEffect(() => {
    return subscribe(() => {
      setActivities(getActivities());
    });
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-ink">Recent Activity</h3>
        <span className="font-body text-xs text-ink-faint">Live feed</span>
      </div>

      <ul className="space-y-3.5 flex-1">
        {activities.slice(0, 5).map((item) => {
          const Icon = ICON_MAP[item.icon] || UserPlus;
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-paper-dim flex items-center justify-center shrink-0 text-ink-soft">
                <Icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm text-ink leading-snug">{item.message}</p>
                <p className="font-body text-xs text-ink-faint mt-0.5">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
