import { createContext, useContext, useRef, useState } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "reactflow";
import { Plus, Trash2 } from "lucide-react";

export const EdgeActions = createContext<{ insert: (edgeId: string) => void; remove: (edgeId: string) => void }>({
  insert: () => {},
  remove: () => {},
});

export function InsertableEdge(p: EdgeProps) {
  const [path, labelX, labelY] = getBezierPath(p);
  const { insert, remove } = useContext(EdgeActions);
  const [hover, setHover] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = () => { clearTimeout(t.current); setHover(true); };
  const leave = () => { t.current = setTimeout(() => setHover(false), 150); };

  return (
    <>
      <BaseEdge id={p.id} path={path} {...(p.markerEnd ? { markerEnd: p.markerEnd } : {})} {...(p.style ? { style: p.style } : {})} />
      <path d={path} fill="none" stroke="transparent" strokeWidth={24} onMouseEnter={enter} onMouseLeave={leave} />
      <EdgeLabelRenderer>
        <div
          onMouseEnter={enter}
          onMouseLeave={leave}
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - 26}px)` }}
          className={`nodrag nopan pointer-events-auto absolute flex gap-1 rounded-md border border-border bg-card p-1 transition-opacity duration-150 ${
            hover ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <button aria-label="Insert node" onClick={() => insert(p.id)} className="rounded p-1 text-muted-foreground hover:bg-background hover:text-primary">
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button aria-label="Delete connection" onClick={() => remove(p.id)} className="rounded p-1 text-muted-foreground hover:bg-background hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
