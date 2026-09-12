import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by organization, role, or folder...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <Search size={16} style={{ color: "var(--text-muted)" }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: "var(--text)" }}
      />
    </div>
  );
}
