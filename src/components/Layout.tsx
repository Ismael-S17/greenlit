import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Table2,
  BarChart3,
  FolderKanban,
  Settings,
  Plus,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/applications", label: "Applications", icon: Table2 },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/folders", label: "Folders", icon: FolderKanban },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      <aside
        className="hidden md:flex w-60 shrink-0 flex-col border-r px-4 py-6"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-status-green flex items-center justify-center text-white font-bold text-sm">
            G
          </div>
          <span className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            Greenlit
          </span>
        </div>

        <NavLink
          to="/add"
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 mb-6 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={16} />
          Add Entry
        </NavLink>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "" : "hover:bg-[var(--surface-2)]"
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? "var(--accent-soft)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-2 text-xs" style={{ color: "var(--text-muted)" }}>
          Data saved locally on this device.
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>

        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around border-t px-2 py-2 z-40"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium"
              style={({ isActive }) => ({
                color: isActive ? "var(--accent)" : "var(--text-muted)",
              })}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/add"
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium"
            style={{ color: "var(--accent)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white -mt-4 shadow-lg"
              style={{ background: "var(--accent)" }}
            >
              <Plus size={18} />
            </div>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
