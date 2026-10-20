import { KINDS, type Kind } from "./nodeTypes";

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card p-4">
      <h2 className="mb-1 text-lg text-foreground">Nodes</h2>
      <p className="mb-4 text-xs text-muted-foreground">Drag onto the canvas</p>
      <div className="space-y-2">
        {(Object.keys(KINDS) as Kind[]).map((k) => {
          const { label, icon: Icon, text } = KINDS[k];
          return (
            <div
              key={k}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/reactflow", k);
                e.dataTransfer.effectAllowed = "move";
              }}
              className="flex cursor-grab items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground hover:border-muted-foreground active:cursor-grabbing"
            >
              <Icon className={`h-4 w-4 ${text}`} strokeWidth={1.75} />
              {label}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
