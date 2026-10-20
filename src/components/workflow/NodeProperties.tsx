import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import type { Node } from "reactflow";
import { getKind, SETTINGS_LABEL, type NodeData } from "./nodeTypes";

export function NodeProperties({ node, onClose, onSave, onDelete }: {
  node: Node<NodeData> | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<NodeData>) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [settings, setSettings] = useState("");
  useEffect(() => {
    if (node) { setName(node.data.name ?? ""); setSettings(node.data.settings ?? ""); }
  }, [node]);
  if (!node) return null;
  const k = getKind(node.data.kind);
  const s = SETTINGS_LABEL[node.data.kind] ?? SETTINGS_LABEL.action;
  const Icon = k.icon;
  const field = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        role="dialog" aria-modal="true" aria-label="Node properties"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); onSave(node.id, { name: name.trim() || undefined, settings }); }}
        className={`w-full max-w-md rounded-lg border border-t-4 border-border bg-card p-5 ${k.border}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${k.text}`} strokeWidth={1.75} />
            <h2 className="text-xl text-foreground">{k.label} settings</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <label className="mb-1 block text-xs text-muted-foreground">Name</label>
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={k.label} className={`${field} mb-4`} />
        <label className="mb-1 block text-xs text-muted-foreground">{s.label}</label>
        <textarea rows={3} value={settings} onChange={(e) => setSettings(e.target.value)} placeholder={s.placeholder} className={`${field} mb-5 resize-none font-mono`} />
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => onDelete(node.id)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Delete node
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:border-muted-foreground">Cancel</button>
            <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}
