import type { Entry, Status } from "../types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function countByStatus(entries: Entry[], status: Status): number {
  return entries.filter((e) => e.status === status).length;
}

export function countCreatedSince(entries: Entry[], sinceMs: number, status?: Status): number {
  const cutoff = Date.now() - sinceMs;
  return entries.filter(
    (e) => new Date(e.createdAt).getTime() >= cutoff && (status ? e.status === status : true),
  ).length;
}

export function weeklyDelta(entries: Entry[], status?: Status): number {
  return countCreatedSince(entries, WEEK_MS, status);
}
