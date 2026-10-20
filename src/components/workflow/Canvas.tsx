import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background, BackgroundVariant, Controls, Handle, Position, addEdge, useReactFlow, useStore,
  type Connection, type Edge, type Node, type NodeProps, type OnNodesChange, type OnEdgesChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus } from "lucide-react";
import { getKind, type Kind, type NodeData } from "./nodeTypes";
import { NodePicker } from "./NodePicker";
import { NodeProperties } from "./NodeProperties";
import { EdgeActions, InsertableEdge } from "./InsertableEdge";

type Data = NodeData;

const AddContext = createContext<(sourceId: string) => void>(() => {});

function FlowNode({ id, data, selected }: NodeProps<Data>) {
  const k = getKind(data.kind);
  const Icon = k.icon;
  const openAdd = useContext(AddContext);
  const hasOutgoing = useStore(useCallback((s: { edges: Edge[] }) => s.edges.some((e) => e.source === id), [id]));
  return (
    <div
      className={`relative min-w-44 cursor-pointer rounded-md border border-t-4 border-border bg-card px-4 py-3 text-foreground ${k.border} ${
        data.active ? `outline-4 outline-offset-2 ${k.outline}` : selected ? "outline outline-1 outline-muted-foreground" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="io-handle" />
      <div className="flex items-center gap-2 text-sm">
        <Icon className={`h-4 w-4 shrink-0 ${k.text}`} strokeWidth={1.75} />
        <span className="max-w-40 truncate">{data.name || k.label}</span>
      </div>
      {data.settings && <div className="mt-1 max-w-40 truncate font-mono text-[10px] text-muted-foreground">{data.settings}</div>}
      <Handle type="source" position={Position.Right} className="io-handle" />
      {!hasOutgoing && (
        <button
          aria-label="Add next node"
          title="Add next node"
          onClick={(e) => { e.stopPropagation(); openAdd(id); }}
          className="nodrag absolute -right-10 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="h-3 w-3" strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}
const nodeTypes = { flow: FlowNode };
const edgeTypes = { insertable: InsertableEdge };

type PickMode = { type: "empty" } | { type: "after"; sourceId: string } | { type: "between"; edgeId: string };

let seq = 0;
const GAP = 300;

export function Canvas(props: {
  nodes: Node<Data>[]; edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node<Data>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange; onEdgesChange: OnEdgesChange;
}) {
  const { setNodes, setEdges } = props;
  const { screenToFlowPosition, fitView } = useReactFlow();
  const wrap = useRef<HTMLDivElement>(null);
  const [pickMode, setPickMode] = useState<PickMode | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const onConnect = useCallback((c: Connection) => setEdges((e) => addEdge({ ...c, animated: true }, e)), [setEdges]);
  const openAdd = useCallback((sourceId: string) => setPickMode({ type: "after", sourceId }), []);
  const edgeActions = useMemo(() => ({
    insert: (edgeId: string) => setPickMode({ type: "between", edgeId }),
    remove: (edgeId: string) => setEdges((e) => e.filter((x) => x.id !== edgeId)),
  }), [setEdges]);

  const edges = useMemo(() => props.edges.map((e) => (e.type ? e : { ...e, type: "insertable" })), [props.edges]);

  const pick = (kind: Kind) => {
    if (!pickMode) return;
    const newId = `n${Date.now()}-${seq++}`;
    const newNode = (position: { x: number; y: number }): Node<Data> => ({ id: newId, type: "flow", position, data: { kind, active: false } });

    if (pickMode.type === "empty") {
      const r = wrap.current!.getBoundingClientRect();
      const c = screenToFlowPosition({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      setNodes((n) => n.concat(newNode({ x: c.x - 88, y: c.y - 24 })));
    } else if (pickMode.type === "after") {
      const source = props.nodes.find((n) => n.id === pickMode.sourceId);
      if (source) {
        const x = source.position.x + GAP;
        let y = source.position.y;
        while (props.nodes.some((n) => Math.abs(n.position.x - x) < 200 && Math.abs(n.position.y - y) < 80)) y += 110;
        setNodes((n) => n.concat(newNode({ x, y })));
        setEdges((e) => addEdge({ id: `e-${source.id}-${newId}`, source: source.id, target: newId, animated: true }, e));
      }
    } else {
      const edge = props.edges.find((e) => e.id === pickMode.edgeId);
      const source = edge && props.nodes.find((n) => n.id === edge.source);
      if (edge && source) {
        // shift the target and everything downstream of it to make room
        const shift = new Set<string>();
        const queue = [edge.target];
        while (queue.length) {
          const id = queue.shift()!;
          if (shift.has(id) || id === source.id) continue;
          shift.add(id);
          props.edges.filter((e) => e.source === id).forEach((e) => queue.push(e.target));
        }
        setNodes((ns) =>
          ns.map((n) => (shift.has(n.id) ? { ...n, position: { x: n.position.x + GAP, y: n.position.y } } : n))
            .concat(newNode({ x: source.position.x + GAP, y: source.position.y })),
        );
        setEdges((es) => es.filter((e) => e.id !== edge.id).concat(
          { id: `e-${edge.source}-${newId}`, source: edge.source, target: newId, animated: true },
          { id: `e-${newId}-${edge.target}`, source: newId, target: edge.target, animated: true },
        ));
      }
    }
    const refit = pickMode.type !== "empty";
    setPickMode(null);
    if (refit) setTimeout(() => fitView({ duration: 300, padding: 0.3, maxZoom: 1 }), 200);
  };

  const editing = editingId ? props.nodes.find((n) => n.id === editingId) ?? null : null;

  return (
    <div ref={wrap} className="relative h-full flex-1">
      <AddContext.Provider value={openAdd}>
        <EdgeActions.Provider value={edgeActions}>
          <ReactFlow
            nodes={props.nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
            onNodesChange={props.onNodesChange} onEdgesChange={props.onEdgesChange} onConnect={onConnect}
            onNodeClick={(_, n) => setEditingId(n.id)}
            defaultEdgeOptions={{ type: "insertable", animated: true }}
            deleteKeyCode={["Backspace", "Delete"]} fitView className="bg-background"
          >
            <Background variant={BackgroundVariant.Dots} color="#333" gap={20} size={1.5} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </EdgeActions.Provider>
      </AddContext.Provider>
      {props.nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => setPickMode({ type: "empty" })}
            aria-label="Add first node"
            className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card text-primary hover:border-primary"
          >
            <Plus className="h-9 w-9" strokeWidth={1.5} />
          </button>
          <p className="text-sm text-muted-foreground">Add your first step</p>
        </div>
      )}
      <NodePicker open={!!pickMode} onClose={() => setPickMode(null)} onPick={pick} />
      <NodeProperties
        node={editing}
        onClose={() => setEditingId(null)}
        onSave={(id, patch) => { setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))); setEditingId(null); }}
        onDelete={(id) => { setNodes((ns) => ns.filter((n) => n.id !== id)); setEdges((es) => es.filter((e) => e.source !== id && e.target !== id)); setEditingId(null); }}
      />
    </div>
  );
}
