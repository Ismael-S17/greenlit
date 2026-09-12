import { useState } from "react";
import type { Entry, Folder } from "../types";
import EntryCard from "./EntryCard";
import { ChevronDown } from "lucide-react";

export default function FolderPanel({ folder, entries }: { folder: Folder; entries: Entry[] }) {
  const [open, setOpen] = useState(entries.length > 0 && entries.length <= 6);

  const counts = {
    green: entries.filter((e) => e.status === "green").length,
    yellow: entries.filter((e) => e.status === "yellow").length,
    red: entries.filter((e) => e.status === "red").length,
    grey: entries.filter((e) => e.status === "grey").length,
  };

  const visible = open ? entries : entries.slice(0, 3);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
            {folder.name}
          </span>
          <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
            {entries.length} tracked
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            {counts.green > 0 && <Dot color="var(--color-status-green)" count={counts.green} />}
            {counts.yellow > 0 && <Dot color="var(--color-status-yellow)" count={counts.yellow} />}
            {counts.red > 0 && <Dot color="var(--color-status-red)" count={counts.red} />}
            {counts.grey > 0 && <Dot color="var(--color-status-grey)" count={counts.grey} />}
          </div>
          <ChevronDown
            size={16}
            className="transition-transform"
            style={{
              color: "var(--text-muted)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>
      {entries.length === 0 ? (
        <div className="px-4 pb-4 text-sm" style={{ color: "var(--text-muted)" }}>
          Nothing here yet.
        </div>
      ) : (
        <div className="px-2 pb-2 flex flex-col">
          {visible.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
          {!open && entries.length > 3 && (
            <button
              onClick={() => setOpen(true)}
              className="text-xs text-center py-2 font-medium"
              style={{ color: "var(--accent)" }}
            >
              Show {entries.length - 3} more
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Dot({ color, count }: { color: string; count: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {count}
    </span>
  );
}
