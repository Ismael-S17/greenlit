export type UrgencyTier = "none" | "normal" | "warning" | "urgent" | "past";

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function hoursUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return (target - now) / (1000 * 60 * 60);
}

export function urgencyTier(dateStr?: string): UrgencyTier {
  if (!dateStr) return "none";
  const hours = hoursUntil(dateStr);
  if (hours < 0) return "past";
  if (hours <= 48) return "urgent";
  if (hours <= 24 * 7) return "warning";
  return "normal";
}

export function countdownLabel(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function toDateInputValue(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}
