import { X } from "lucide-react";
import { CATEGORIES, KINDS, type Kind } from "./nodeTypes";

export function NodePicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (k: Kind) => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add a node"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-border bg-card p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl text-foreground">Add a node</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="space-y-4">
          {CATEGORIES.map(({ title, kinds }) => (
            <div key={title}>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
              <div className="grid grid-cols-2 gap-2">
                {kinds.map((k) => {
                  const { label, icon: Icon, text, border } = KINDS[k];
                  return (
                    <button
                      key={k}
                      onClick={() => onPick(k)}
                      className={`flex items-center gap-2 rounded-md border border-l-4 border-border bg-background px-3 py-2.5 text-left text-sm text-foreground hover:border-muted-foreground ${border.replace("border-t-", "border-l-")}`}
                    >
                      <Icon className={`h-4 w-4 ${text}`} strokeWidth={1.75} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
