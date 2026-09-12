import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ActivityLogEntry, AppState, Entry, Folder, Status } from "../types";
import { UNCATEGORIZED_FOLDER_ID } from "../types";
import { loadState, saveState } from "../lib/storage";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface AppStoreValue {
  state: AppState;
  addEntry: (entry: Omit<Entry, "id" | "activityLog" | "createdAt" | "updatedAt">) => Entry;
  updateEntry: (id: string, patch: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  setEntryStatus: (id: string, status: Status) => void;
  moveEntryToFolder: (id: string, folderId: string) => void;
  addActivityLog: (entryId: string, text: string, date?: string) => void;
  addFolder: (name: string) => Folder;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  replaceState: (next: AppState) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  const addEntry = useCallback<AppStoreValue["addEntry"]>((entry) => {
    const now = new Date().toISOString();
    const newEntry: Entry = {
      ...entry,
      id: uid(),
      activityLog: [],
      createdAt: now,
      updatedAt: now,
    };
    setState((s) => ({ ...s, entries: [newEntry, ...s.entries] }));
    return newEntry;
  }, []);

  const updateEntry = useCallback((id: string, patch: Partial<Entry>) => {
    setState((s) => ({
      ...s,
      entries: s.entries.map((e) =>
        e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e,
      ),
    }));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }));
  }, []);

  const setEntryStatus = useCallback((id: string, status: Status) => {
    setState((s) => ({
      ...s,
      entries: s.entries.map((e) =>
        e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e,
      ),
    }));
  }, []);

  const moveEntryToFolder = useCallback((id: string, folderId: string) => {
    setState((s) => ({
      ...s,
      entries: s.entries.map((e) =>
        e.id === id ? { ...e, folderId, updatedAt: new Date().toISOString() } : e,
      ),
    }));
  }, []);

  const addActivityLog = useCallback((entryId: string, text: string, date?: string) => {
    const log: ActivityLogEntry = {
      id: uid(),
      date: date ?? new Date().toISOString(),
      text,
    };
    setState((s) => ({
      ...s,
      entries: s.entries.map((e) =>
        e.id === entryId
          ? {
              ...e,
              activityLog: [log, ...e.activityLog],
              updatedAt: new Date().toISOString(),
            }
          : e,
      ),
    }));
  }, []);

  const addFolder = useCallback((name: string) => {
    const folder: Folder = { id: uid(), name, createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, folders: [...s.folders, folder] }));
    return folder;
  }, []);

  const renameFolder = useCallback((id: string, name: string) => {
    setState((s) => ({
      ...s,
      folders: s.folders.map((f) => (f.id === id ? { ...f, name } : f)),
    }));
  }, []);

  const deleteFolder = useCallback((id: string) => {
    if (id === UNCATEGORIZED_FOLDER_ID) return;
    setState((s) => ({
      ...s,
      folders: s.folders.filter((f) => f.id !== id),
      entries: s.entries.map((e) =>
        e.folderId === id ? { ...e, folderId: UNCATEGORIZED_FOLDER_ID } : e,
      ),
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState((s) => ({ ...s, darkMode: !s.darkMode }));
  }, []);

  const setDarkMode = useCallback((value: boolean) => {
    setState((s) => ({ ...s, darkMode: value }));
  }, []);

  const replaceState = useCallback((next: AppState) => {
    setState(next);
  }, []);

  const value = useMemo<AppStoreValue>(
    () => ({
      state,
      addEntry,
      updateEntry,
      deleteEntry,
      setEntryStatus,
      moveEntryToFolder,
      addActivityLog,
      addFolder,
      renameFolder,
      deleteFolder,
      toggleDarkMode,
      setDarkMode,
      replaceState,
    }),
    [
      state,
      addEntry,
      updateEntry,
      deleteEntry,
      setEntryStatus,
      moveEntryToFolder,
      addActivityLog,
      addFolder,
      renameFolder,
      deleteFolder,
      toggleDarkMode,
      setDarkMode,
      replaceState,
    ],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
