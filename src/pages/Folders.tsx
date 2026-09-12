import { useState } from "react";
import { useAppStore } from "../store/AppStore";
import { UNCATEGORIZED_FOLDER_ID } from "../types";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

export default function Folders() {
  const { state, addFolder, renameFolder, deleteFolder } = useAppStore();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addFolder(newName.trim());
    setNewName("");
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) renameFolder(editingId, editValue.trim());
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    deleteFolder(id);
    setConfirmId(null);
  };

  const countFor = (id: string) => state.entries.filter((e) => e.folderId === id).length;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
          Folders
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Organize your pipeline your way.
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New folder name, e.g. Banking"
          className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none border focus:border-[var(--accent)]"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <button
          type="submit"
          className="rounded-xl px-4 flex items-center gap-1.5 text-sm font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={16} />
          Create
        </button>
      </form>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
      >
        {state.folders.map((folder, i) => (
          <div
            key={folder.id}
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: i < state.folders.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            {editingId === folder.id ? (
              <>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  className="flex-1 rounded-lg px-2.5 py-1.5 text-sm outline-none border focus:border-[var(--accent)]"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
                />
                <button onClick={commitEdit} className="p-1.5 rounded-lg hover:bg-[var(--border)]">
                  <Check size={16} style={{ color: "var(--color-status-green)" }} />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-[var(--border)]">
                  <X size={16} style={{ color: "var(--text-muted)" }} />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {folder.name}
                  </span>
                  <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
                    {countFor(folder.id)} tracked
                  </span>
                </div>
                {folder.id !== UNCATEGORIZED_FOLDER_ID && (
                  <>
                    <button
                      onClick={() => startEdit(folder.id, folder.name)}
                      className="p-1.5 rounded-lg hover:bg-[var(--border)]"
                    >
                      <Pencil size={14} style={{ color: "var(--text-muted)" }} />
                    </button>
                    <button
                      onClick={() => handleDelete(folder.id)}
                      onBlur={() => setConfirmId(null)}
                      className="p-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                      style={{
                        color: confirmId === folder.id ? "#fff" : "var(--color-status-red)",
                        background: confirmId === folder.id ? "var(--color-status-red)" : "transparent",
                      }}
                    >
                      <Trash2 size={14} />
                      {confirmId === folder.id && "Confirm"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
