import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: number;
  deltaLabel?: string;
  icon?: ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, delta, deltaLabel, icon, accent }: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 min-w-0"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        {icon && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: accent ?? "var(--accent-soft)", color: accent ? "#fff" : "var(--accent)" }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${
              positive ? "text-status-green" : "text-status-red"
            }`}
          >
            {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(delta)} {deltaLabel}
          </span>
        )}
      </div>
    </div>
  );
}
