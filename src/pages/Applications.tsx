import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import StatusPill from "../components/StatusPill";
import SearchBar from "../components/SearchBar";
import { formatDate } from "../lib/dates";
import type { Entry } from "../types";
import { ExternalLink, ArrowUpDown } from "lucide-react";

type SortKey = "organization" | "dateApplied" | "status" | "updatedAt" | "role" | "platform";

export default function Applications() {
  const { state } = useAppStore();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const folderNameById = new Map(state.folders.map((f) => [f.id, f.name]));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = state.entries;
    if (q) {
      list = list.filter(
        (e) =>
          e.organization.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          (folderNameById.get(e.folderId) ?? "").toLowerCase().includes(q),
      );
    }
    const sorted = [...list].sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.entries, query, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const toggleRow = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((s) => (s.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))));
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "organization", label: "Company" },
    { key: "role", label: "Role" },
    { key: "platform", label: "Method" },
    { key: "dateApplied", label: "Date Applied" },
    { key: "status", label: "Status" },
    { key: "updatedAt", label: "Last Update" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
          Applications
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {rows.length} entr{rows.length === 1 ? "y" : "ies"}
          {selected.size > 0 ? ` · ${selected.size} selected` : ""}
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div
        className="rounded-2xl overflow-x-auto"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
      >
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size > 0 && selected.size === rows.length}
                  onChange={toggleAll}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="text-left px-3 py-3 font-medium cursor-pointer select-none whitespace-nowrap"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown size={12} opacity={sortKey === col.key ? 1 : 0.3} />
                  </span>
                </th>
              ))}
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => (
              <tr
                key={entry.id}
                style={{ borderBottom: "1px solid var(--border)" }}
                className="hover:bg-[var(--surface-2)]"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(entry.id)}
                    onChange={() => toggleRow(entry.id)}
                  />
                </td>
                <td className="px-3 py-3 font-medium whitespace-nowrap">
                  <Link to={`/entry/${entry.id}`} style={{ color: "var(--text)" }}>
                    {entry.organization}
                  </Link>
                </td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {entry.role}
                </td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {entry.platform}
                </td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {formatDate(entry.dateApplied)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <StatusPill status={entry.status} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {formatDate(entry.updatedAt)}
                </td>
                <td className="px-3 py-3 text-right">
                  {entry.url && (
                    <a href={entry.url} target="_blank" rel="noreferrer" className="inline-flex p-1">
                      <ExternalLink size={14} style={{ color: "var(--text-muted)" }} />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
            No entries yet.
          </p>
        )}
      </div>
    </div>
  );
}

function sortValue(entry: Entry, key: SortKey): string {
  switch (key) {
    case "dateApplied":
      return entry.dateApplied;
    case "updatedAt":
      return entry.updatedAt;
    case "status":
      return entry.status;
    case "role":
      return entry.role.toLowerCase();
    case "platform":
      return entry.platform.toLowerCase();
    default:
      return entry.organization.toLowerCase();
  }
}
