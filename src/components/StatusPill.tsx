import type { Status } from "../types";
import { STATUS_LABELS } from "../types";

const STYLES: Record<Status, string> = {
  green: "bg-status-green-soft text-status-green dark:bg-status-green/15 dark:text-green-400",
  yellow: "bg-status-yellow-soft text-status-yellow dark:bg-status-yellow/15 dark:text-yellow-400",
  red: "bg-status-red-soft text-status-red dark:bg-status-red/15 dark:text-red-400",
  grey: "bg-status-grey-soft text-status-grey dark:bg-status-grey/15 dark:text-gray-400",
};

export default function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
