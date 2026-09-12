import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { detectPlatform } from "../lib/platform";
import type { OpportunityType, Platform } from "../types";
import { UNCATEGORIZED_FOLDER_ID } from "../types";
import { ArrowLeft } from "lucide-react";

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

export default function AddEntry() {
  const { state, addEntry } = useAppStore();
  const navigate = useNavigate();

  const [type, setType] = useState<OpportunityType>("Job");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("LinkedIn");
  const [platformTouched, setPlatformTouched] = useState(false);
  const [folderId, setFolderId] = useState(UNCATEGORIZED_FOLDER_ID);
  const [dateApplied, setDateApplied] = useState(() => new Date().toISOString().slice(0, 10));
  const [deadlineDate, setDeadlineDate] = useState("");
  const [awardAmount, setAwardAmount] = useState("");

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (!platformTouched) {
      const detected = detectPlatform(value);
      if (detected) setPlatform(detected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization.trim() || !role.trim()) return;
    const entry = addEntry({
      organization: organization.trim(),
      role: role.trim(),
      type,
      platform,
      dateApplied: new Date(dateApplied).toISOString(),
      status: "grey",
      folderId,
      url: url.trim(),
      deadlineDate: deadlineDate ? new Date(deadlineDate).toISOString() : undefined,
      awardAmount: awardAmount ? Number(awardAmount) : undefined,
    });
    navigate(`/entry/${entry.id}`);
  };

  const inputClass =
    "w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-colors focus:border-[var(--accent)]";
  const inputStyle = { background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" };

  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 py-6 md:py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>
        Add Entry
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Log it now, sort it out later.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="rounded-xl py-2.5 text-sm font-medium border transition-colors"
              style={{
                background: type === t ? "var(--accent-soft)" : "var(--surface)",
                borderColor: type === t ? "var(--accent)" : "var(--border)",
                color: type === t ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
            Listing URL
          </label>
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Paste the job/scholarship link"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
              Organization
            </label>
            <input
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Goldman Sachs"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
              Role / Title
            </label>
            <input
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Summer Analyst"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value as Platform);
                setPlatformTouched(true);
              }}
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
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
              Date Applied
            </label>
            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
              Deadline (optional)
            </label>
            <input
              type="date"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {type === "Scholarship" && (
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>
              Award Amount (optional)
            </label>
            <input
              type="number"
              min="0"
              value={awardAmount}
              onChange={(e) => setAwardAmount(e.target.value)}
              placeholder="$"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        )}

        <button
          type="submit"
          className="rounded-xl py-3 text-sm font-semibold text-white mt-2"
          style={{ background: "var(--accent)" }}
        >
          Save Entry
        </button>
      </form>
    </div>
  );
}
