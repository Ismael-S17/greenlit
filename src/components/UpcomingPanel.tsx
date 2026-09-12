import { useState } from "react";
import { Link } from "react-router-dom";
import type { Entry } from "../types";
import { urgencyTier, countdownLabel, formatDateShort, hoursUntil } from "../lib/dates";
import StatusBadge from "./StatusBadge";
import { Bell, Flag } from "lucide-react";

interface UpcomingItem {
  entry: Entry;
  date: string;
  kind: "reminder" | "deadline";
}

const TIER_TEXT: Record<string, string> = {
  urgent: "text-status-red",
  warning: "text-status-yellow",
  normal: "text-[var(--text-muted)]",
  past: "text-status-red",
};

export default function UpcomingPanel({ entries }: { entries: Entry[] }) {
  const [showAll, setShowAll] = useState(false);

  const items: UpcomingItem[] = [];
  for (const entry of entries) {
    if (entry.reminderDate) items.push({ entry, date: entry.reminderDate, kind: "reminder" });
    if (entry.deadlineDate) items.push({ entry, date: entry.deadlineDate, kind: "deadline" });
  }

  const upcoming = items
    .filter((i) => hoursUntil(i.date) > -48)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const visible = showAll ? upcoming : upcoming.slice(0, 5);

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Upcoming
        </h3>
        {upcoming.length > 5 && (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="text-xs font-medium"
            style={{ color: "var(--accent)" }}
          >
            {showAll ? "Show less" : `See all (${upcoming.length})`}
          </button>
        )}
      </div>

      {upcoming.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Nothing on the horizon. Add reminder or deadline dates to entries to see them here.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {visible.map((item) => {
            const tier = item.kind === "deadline" ? urgencyTier(item.date) : "normal";
            return (
              <Link
                key={`${item.entry.id}-${item.kind}`}
                to={`/entry/${item.entry.id}`}
                className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[var(--surface-2)]"
              >
                <StatusBadge status={item.entry.status} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                    {item.entry.organization}
                  </div>
                  <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                    {item.entry.role}
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium shrink-0 ${TIER_TEXT[tier]}`}>
                  {item.kind === "deadline" ? <Flag size={12} /> : <Bell size={12} />}
                  {item.kind === "deadline" ? countdownLabel(item.date) : formatDateShort(item.date)}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
