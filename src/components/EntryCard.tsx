import { useNavigate } from "react-router-dom";
import type { Entry } from "../types";
import StatusBadge from "./StatusBadge";
import UrgencyBadge from "./UrgencyBadge";
import MoveMenu from "./MoveMenu";
import { formatDateShort } from "../lib/dates";
import { ExternalLink } from "lucide-react";

export default function EntryCard({ entry }: { entry: Entry }) {
  const navigate = useNavigate();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/entry/${entry.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/entry/${entry.id}`)}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-2)] cursor-pointer"
    >
      <StatusBadge status={entry.status} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate" style={{ color: "var(--text)" }}>
            {entry.organization}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
            style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
          >
            {entry.type}
          </span>
        </div>
        <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
          {entry.role} · {formatDateShort(entry.dateApplied)}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {entry.deadlineDate && <UrgencyBadge date={entry.deadlineDate} />}
        <MoveMenu entryId={entry.id} folderId={entry.folderId} />
        {entry.url && (
          <a
            href={entry.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-[var(--border)]"
            title="Open listing"
          >
            <ExternalLink size={14} style={{ color: "var(--text-muted)" }} />
          </a>
        )}
      </div>
    </div>
  );
}
