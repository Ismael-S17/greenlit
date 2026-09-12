import { useMemo, useState } from "react";
import { useAppStore } from "../store/AppStore";
import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import UpcomingPanel from "../components/UpcomingPanel";
import FolderPanel from "../components/FolderPanel";
import EntryCard from "../components/EntryCard";
import { weeklyDelta, countByStatus } from "../lib/stats";
import { Briefcase, CheckCircle2, Clock3, XCircle } from "lucide-react";

export default function Dashboard() {
  const { state } = useAppStore();
  const [query, setQuery] = useState("");

  const total = state.entries.length;
  const green = countByStatus(state.entries, "green");
  const yellow = countByStatus(state.entries, "yellow");
  const red = countByStatus(state.entries, "red");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const folderNameById = new Map(state.folders.map((f) => [f.id, f.name]));
    return state.entries.filter((e) => {
      const folderName = folderNameById.get(e.folderId)?.toLowerCase() ?? "";
      return (
        e.organization.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        folderName.includes(q)
      );
    });
  }, [query, state.entries, state.folders]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Your whole pipeline, at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Tracked"
          value={total}
          delta={weeklyDelta(state.entries)}
          deltaLabel="this week"
          icon={<Briefcase size={14} />}
        />
        <StatCard
          label="In Review"
          value={yellow}
          delta={weeklyDelta(state.entries, "yellow")}
          deltaLabel="this week"
          icon={<Clock3 size={14} />}
          accent="var(--color-status-yellow)"
        />
        <StatCard
          label="Interview / Offer"
          value={green}
          delta={weeklyDelta(state.entries, "green")}
          deltaLabel="this week"
          icon={<CheckCircle2 size={14} />}
          accent="var(--color-status-green)"
        />
        <StatCard
          label="Rejected"
          value={red}
          delta={weeklyDelta(state.entries, "red")}
          deltaLabel="this week"
          icon={<XCircle size={14} />}
          accent="var(--color-status-red)"
        />
      </div>

      <SearchBar value={query} onChange={setQuery} />

      {filtered ? (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--text)" }}>
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
          {filtered.length === 0 ? (
            <p className="px-4 pb-4 text-sm" style={{ color: "var(--text-muted)" }}>
              Nothing matches "{query}".
            </p>
          ) : (
            <div className="px-2 pb-2">
              {filtered.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <UpcomingPanel entries={state.entries} />

          <div className="flex flex-col gap-4">
            {state.folders.map((folder) => (
              <FolderPanel
                key={folder.id}
                folder={folder}
                entries={state.entries.filter((e) => e.folderId === folder.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
