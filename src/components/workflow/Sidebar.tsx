import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORIES, KINDS } from "./nodeTypes";

export function Sidebar() {
  const [open, setOpen] = useState<Record<string, boolean>>({ Triggers: true, "AI & Data": true, Actions: true });

  return (
    <aside className="w-60 shrink-0 overflow-y-auto border-r border-border bg-card p-4">
      <h2 className="mb-1 text-lg text-foreground">Nodes</h2>
      <p className="mb-4 text-xs text-muted-foreground">Drag onto the canvas</p>
      <div className="space-y-1">
        {CATEGORIES.map(({ title, kinds }) => {
          const isOpen = open[title];
          return (
            <div key={title} className="border-b border-border pb-1">
              <button
                onClick={() => setOpen((o) => ({ ...o, [title]: !o[title] }))}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {title}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} strokeWidth={1.75} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="space-y-2 pb-2">
                    {kinds.map((k) => {
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
