import { FolderInput } from "lucide-react";
import { useAppStore } from "../store/AppStore";

export default function MoveMenu({ entryId, folderId }: { entryId: string; folderId: string }) {
  const { state, moveEntryToFolder } = useAppStore();

  return (
    <div
      className="relative inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-[var(--border)]"
      title="Move to folder"
      onClick={(e) => e.stopPropagation()}
    >
      <FolderInput size={14} style={{ color: "var(--text-muted)" }} />
      <select
        value={folderId}
        onChange={(e) => moveEntryToFolder(entryId, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        aria-label="Move to folder"
      >
        {state.folders.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}
