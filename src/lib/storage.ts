import type { AppState } from "../types";
import { UNCATEGORIZED_FOLDER_ID } from "../types";

const STORAGE_KEY = "greenlit:v1";

export const defaultState: AppState = {
  entries: [],
  folders: [
    {
      id: UNCATEGORIZED_FOLDER_ID,
      name: "Uncategorized",
      createdAt: new Date().toISOString(),
    },
  ],
  darkMode: false,
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.folders?.some((f) => f.id === UNCATEGORIZED_FOLDER_ID)) {
      parsed.folders = [
        ...(parsed.folders ?? []),
        {
          id: UNCATEGORIZED_FOLDER_ID,
          name: "Uncategorized",
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable or quota exceeded — fail silently
  }
}
