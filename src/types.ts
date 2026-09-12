export type OpportunityType = "Job" | "Internship" | "Scholarship";

export type Platform =
  | "LinkedIn"
  | "Indeed"
  | "Handshake"
  | "Company Site"
  | "Scholarship Portal"
  | "Referral"
  | "Other";

export type Status = "grey" | "yellow" | "green" | "red";

export const STATUS_ORDER: Status[] = ["grey", "yellow", "green", "red"];

export const STATUS_LABELS: Record<Status, string> = {
  grey: "Submitted",
  yellow: "In Review",
  green: "Interview / Offer",
  red: "Rejected",
};

export interface ActivityLogEntry {
  id: string;
  date: string; // ISO date string
  text: string;
}

export interface Entry {
  id: string;
  organization: string;
  role: string;
  type: OpportunityType;
  platform: Platform;
  dateApplied: string; // ISO date string
  status: Status;
  folderId: string;
  url: string;
  reminderDate?: string; // ISO date string
  deadlineDate?: string; // ISO date string
  awardAmount?: number;
  activityLog: ActivityLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface AppState {
  entries: Entry[];
  folders: Folder[];
  darkMode: boolean;
}

export const UNCATEGORIZED_FOLDER_ID = "uncategorized";
