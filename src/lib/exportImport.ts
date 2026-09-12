import type { AppState, Entry } from "../types";

export function exportJSON(state: AppState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  downloadBlob(blob, `greenlit-backup-${dateStamp()}.json`);
}

export function exportCSV(state: AppState) {
  const folderNameById = new Map(state.folders.map((f) => [f.id, f.name]));
  const headers = [
    "Organization",
    "Role",
    "Type",
    "Platform",
    "Folder",
    "Date Applied",
    "Status",
    "URL",
    "Reminder Date",
    "Deadline Date",
    "Award Amount",
    "Activity Log",
  ];
  const rows = state.entries.map((e) => [
    e.organization,
    e.role,
    e.type,
    e.platform,
    folderNameById.get(e.folderId) ?? "",
    e.dateApplied,
    e.status,
    e.url,
    e.reminderDate ?? "",
    e.deadlineDate ?? "",
    e.awardAmount != null ? String(e.awardAmount) : "",
    e.activityLog.map((a) => `${a.date}: ${a.text}`).join(" | "),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  downloadBlob(blob, `greenlit-export-${dateStamp()}.csv`);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function parseImportedJSON(text: string): AppState {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed.entries) || !Array.isArray(parsed.folders)) {
    throw new Error("Invalid backup file format");
  }
  return parsed as AppState;
}

export function validateEntries(entries: unknown): entries is Entry[] {
  return Array.isArray(entries);
}
