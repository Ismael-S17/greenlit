import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppStore } from "../store/AppStore";
import { STATUS_LABELS, type Status } from "../types";
import { statusColor } from "../components/StatusBadge";

const STATUS_ORDER_FOR_DONUT: Status[] = ["grey", "yellow", "green", "red"];

export default function Analytics() {
  const { state } = useAppStore();

  const monthly = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString(undefined, { month: "short" }),
        count: 0,
      });
    }
    const byKey = new Map(months.map((m) => [m.key, m]));
    for (const entry of state.entries) {
      const d = new Date(entry.dateApplied);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = byKey.get(key);
      if (bucket) bucket.count += 1;
    }
    return months;
  }, [state.entries]);

  const statusData = useMemo(() => {
    return STATUS_ORDER_FOR_DONUT.map((status) => ({
      name: STATUS_LABELS[status],
      value: state.entries.filter((e) => e.status === status).length,
      color: statusColor(status),
    })).filter((d) => d.value > 0);
  }, [state.entries]);

  const total = state.entries.length;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
          Analytics
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Track your momentum over time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
            Application Activity
          </h3>
          {total === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "var(--text)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
            Status Distribution
          </h3>
          {total === 0 ? (
            <EmptyState />
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    strokeWidth={0}
                    isAnimationActive={false}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "var(--text)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
                  {total}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  total
                </span>
              </div>
            </div>
          )}
          {statusData.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {statusData.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-[240px] flex items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>
      Add a few entries to see your analytics.
    </div>
  );
}
