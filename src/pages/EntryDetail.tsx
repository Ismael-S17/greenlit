import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import StatusSlider from "../components/StatusSlider";
import UrgencyBadge from "../components/UrgencyBadge";
import { formatDate, toDateInputValue } from "../lib/dates";
import type { OpportunityType, Platform } from "../types";
import { ArrowLeft, ExternalLink, Trash2, Plus } from "lucide-react";

const TYPES: OpportunityType[] = ["Job", "Internship", "Scholarship"];
const PLATFORMS: Platform[] = [
  "LinkedIn",
  "Indeed",
  "Handshake",
  "Company Site",
  "Scholarship Portal",
  "Referral",
  "Other",
];

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, updateEntry, deleteEntry, setEntryStatus, addActivityLog } = useAppStore();
  const [logText, setLogText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const entry = state.entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p style={{ color: "var(--text-muted)" }}>Entry not found.</p>
        <Link to="/" className="text-sm font-medium" style={{ color: "var(--accent)" }}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-colors focus:border-[var(--accent)]";
  const inputStyle = { background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" };

  const handleAddLog = () => {
    if (!logText.trim()) return;
    addActivityLog(entry.id, logText.trim());
    setLogText("");
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteEntry(entry.id);
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={handleDelete}
          onBlur={() => setConfirmDelete(false)}
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg"
          style={{
            color: confirmDelete ? "#fff" : "var(--color-status-red)",
            background: confirmDelete ? "var(--color-status-red)" : "transparent",
          }}
        >
          <Trash2 size={14} />
          {confirmDelete ? "Confirm delete" : "Delete"}
        </button>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <input
              value={entry.organization}
              onChange={(e) => updateEntry(entry.id, { organization: e.target.value })}
              className="text-xl font-semibold bg-transparent outline-none w-full"
              style={{ color: "var(--text)" }}
            />
            <input
              value={entry.role}
              onChange={(e) => updateEntry(entry.id, { role: e.target.value })}
              className="text-sm bg-transparent outline-none w-full mt-0.5"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl shrink-0 text-white"
              style={{ background: "var(--accent)" }}
            >
              <ExternalLink size={14} />
              Open Listing
            </a>
          )}
        </div>

        <StatusSlider status={entry.status} onChange={(s) => setEntryStatus(entry.id, s)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
            Type
          </label>
          <select
            value={entry.type}
            onChange={(e) => updateEntry(entry.id, { type: e.target.value as OpportunityType })}
            className={inputClass}
            style={inputStyle}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
            Platform
          </label>
          <select
            value={entry.platform}
            onChange={(e) => updateEntry(entry.id, { platform: e.target.value as Platform })}
            className={inputClass}
            style={inputStyle}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
            Folder
          </label>
          <select
            value={entry.folderId}
            onChange={(e) => updateEntry(entry.id, { folderId: e.target.value })}
            className={inputClass}
            style={inputStyle}
          >
            {state.folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
            Listing URL
          </label>
          <input
            value={entry.url}
            onChange={(e) => updateEntry(entry.id, { url: e.target.value })}
            placeholder="https://..."
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
            Date Applied
          </label>
          <input
            type="date"
            value={toDateInputValue(entry.dateApplied)}
            onChange={(e) => updateEntry(entry.id, { dateApplied: new Date(e.target.value).toISOString() })}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
            Reminder Date
          </label>
          <input
            type="date"
            value={toDateInputValue(entry.reminderDate)}
            onChange={(e) =>
              updateEntry(entry.id, {
                reminderDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
            Deadline
            {entry.deadlineDate && <UrgencyBadge date={entry.deadlineDate} />}
          </label>
          <input
            type="date"
            value={toDateInputValue(entry.deadlineDate)}
            onChange={(e) =>
              updateEntry(entry.id, {
                deadlineDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </div>
        {entry.type === "Scholarship" && (
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
              Award Amount
            </label>
            <input
              type="number"
              min="0"
              value={entry.awardAmount ?? ""}
              onChange={(e) =>
                updateEntry(entry.id, {
                  awardAmount: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className={inputClass}
              style={inputStyle}
            />
          </div>
        )}
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
          Activity Log
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddLog()}
            placeholder="e.g. Followed up with recruiter"
            className={inputClass}
            style={inputStyle}
          />
          <button
            onClick={handleAddLog}
            className="rounded-xl px-3 flex items-center justify-center text-white shrink-0"
            style={{ background: "var(--accent)" }}
          >
            <Plus size={16} />
          </button>
        </div>

        {entry.activityLog.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No activity logged yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {entry.activityLog.map((log) => (
              <li key={log.id} className="flex gap-3 text-sm">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: "var(--accent)" }} />
                <div>
                  <span className="font-medium" style={{ color: "var(--text)" }}>
                    {formatDate(log.date)}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}> — {log.text}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
