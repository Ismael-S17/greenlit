import { countdownLabel, urgencyTier } from "../lib/dates";
import { Clock } from "lucide-react";

const TIER_STYLES: Record<string, string> = {
  normal: "bg-[var(--surface-2)] text-[var(--text-muted)]",
  warning: "bg-status-yellow-soft text-status-yellow dark:bg-status-yellow/15 dark:text-yellow-400",
  urgent: "bg-status-red-soft text-status-red dark:bg-status-red/15 dark:text-red-400 animate-pulse",
  past: "bg-status-red-soft text-status-red dark:bg-status-red/15 dark:text-red-400",
};

export default function UrgencyBadge({ date }: { date: string }) {
  const tier = urgencyTier(date);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${TIER_STYLES[tier]}`}
    >
      <Clock size={11} />
      {countdownLabel(date)}
    </span>
  );
}
