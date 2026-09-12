import { useRef, useState } from "react";
import { useAppStore } from "../store/AppStore";
import { exportCSV, exportJSON, parseImportedJSON } from "../lib/exportImport";
import { Moon, Sun, Download, Upload, Sparkles } from "lucide-react";

export default function Settings() {
  const { state, toggleDarkMode, replaceState } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = parseImportedJSON(text);
      replaceState(imported);
      setImportMessage(`Imported ${imported.entries.length} entries and ${imported.folders.length} folders.`);
    } catch {
      setImportMessage("Couldn't read that file. Make sure it's a Greenlit JSON backup.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
          Settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Preferences and data live on this device only.
        </p>
      </div>

      <Section title="Appearance">
        <Row
          icon={state.darkMode ? <Moon size={16} /> : <Sun size={16} />}
          label="Dark mode"
          description="Flip backgrounds and text contrast. Persists on this device."
        >
          <button
            onClick={toggleDarkMode}
            className="w-11 h-6 rounded-full relative transition-colors shrink-0"
            style={{ background: state.darkMode ? "var(--accent)" : "var(--border)" }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{ transform: state.darkMode ? "translateX(22px)" : "translateX(2px)" }}
            />
          </button>
        </Row>
      </Section>

      <Section title="Backup & Export">
        <Row icon={<Download size={16} />} label="Export JSON" description="Full backup — entries, folders, activity logs.">
          <button
            onClick={() => exportJSON(state)}
            className="text-sm font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            Export
          </button>
        </Row>
        <Row icon={<Download size={16} />} label="Export CSV" description="Spreadsheet-friendly, for a quick scan or sharing.">
          <button
            onClick={() => exportCSV(state)}
            className="text-sm font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            Export
          </button>
        </Row>
        <Row icon={<Upload size={16} />} label="Import backup" description="Restore from a previously exported JSON file.">
          <button
            onClick={handleImportClick}
            className="text-sm font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "var(--surface-2)", color: "var(--text)" }}
          >
            Import
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
        </Row>
        {importMessage && (
          <p className="text-xs px-4 pb-3" style={{ color: "var(--text-muted)" }}>
            {importMessage}
          </p>
        )}
      </Section>

      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "var(--accent-soft)", border: "1px solid var(--border)" }}
      >
        <Sparkles size={18} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <p className="text-sm" style={{ color: "var(--text)" }}>
          Greenlit tracks your pipeline — it doesn't submit applications for you. Once you tap "Open Listing," try{" "}
          <strong>Claude in Chrome</strong> to help fill out the form on that page, in your own browser session.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide mb-2 px-1" style={{ color: "var(--text-muted)" }}>
        {title}
      </h2>
      <div
        className="rounded-2xl overflow-hidden [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-[var(--border)]"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
      >
        {children}
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderColor: "var(--border)" }}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
          {label}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {description}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">{children}</div>
    </div>
  );
}
