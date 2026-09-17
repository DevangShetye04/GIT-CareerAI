import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import { quickActions } from "../../data/companyMockData.js";

export default function QuickActions() {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-ink">Quick Actions</h3>
        <span className="font-body text-xs text-ink-faint">Shortcuts</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className="flex items-center gap-3 rounded-xl border border-line p-3.5 hover:bg-paper-dim transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-soft text-teal group-hover:bg-teal group-hover:text-paper transition-colors flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
              <span className="font-body text-sm font-medium text-ink group-hover:text-teal-dark">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
