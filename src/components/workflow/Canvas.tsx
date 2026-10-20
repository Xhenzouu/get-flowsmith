import { createContext, useCallback, useContext, useRef, useState } from "react";
import ReactFlow, {
  Background, BackgroundVariant, Controls, Handle, Position, addEdge, useReactFlow,
  type Connection, type Edge, type Node, type NodeProps, type OnNodesChange, type OnEdgesChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus } from "lucide-react";
import { getKind, type Kind } from "./nodeTypes";
import { NodePicker } from "./NodePicker";

type Data = { kind: Kind; active: boolean };

const AddContext = createContext<(sourceId: string) => void>(() => {});

function FlowNode({ id, data, selected }: NodeProps<Data>) {
  const k = getKind(data.kind);
  const Icon = k.icon;
  const openAdd = useContext(AddContext);
  return (
    <div
      className={`min-w-44 rounded-md border border-t-4 border-border bg-card px-4 py-3 text-foreground ${k.border} ${
        data.active ? `outline-4 outline-offset-2 ${k.outline}` : selected ? "outline outline-1 outline-muted-foreground" : ""
      }`}
    >
      {!k.trigger && <Handle type="target" position={Position.Left} />}
      <div className="flex items-center gap-2 text-sm">
        <Icon className={`h-4 w-4 ${k.text}`} strokeWidth={1.75} />
        {k.label}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="add-handle"
        onClick={(e) => { e.stopPropagation(); openAdd(id); }}
        title="Add next node"
      >
        <Plus className="pointer-events-none h-3 w-3" strokeWidth={2.25} />
      </Handle>
    </div>
  );
}
const nodeTypes = { flow: FlowNode };

let seq = 0;

export function Canvas(props: {
  nodes: Node<Data>[]; edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node<Data>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange; onEdgesChange: OnEdgesChange;
}) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const wrap = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSourceNodeId, setActiveSourceNodeId] = useState<string | null>(null);
  const onConnect = useCallback((c: Connection) => props.setEdges((e) => addEdge({ ...c, animated: true }, e)), [props]);

  const openAdd = useCallback((sourceId: string | null) => {
    setActiveSourceNodeId(sourceId);
    setModalOpen(true);
  }, []);

  const pick = (kind: Kind) => {
    const newId = `n${Date.now()}-${seq++}`;
    const source = activeSourceNodeId ? props.nodes.find((n) => n.id === activeSourceNodeId) : undefined;
    let position;
    if (source) {
      position = { x: source.position.x + 300, y: source.position.y };
    } else {
      const r = wrap.current!.getBoundingClientRect();
      const c = screenToFlowPosition({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      position = { x: c.x - 88, y: c.y - 24 };
    }
    props.setNodes((n) => n.concat({ id: newId, type: "flow", position, data: { kind, active: false } }));
    if (source && !getKind(kind).trigger) {
      props.setEdges((e) => addEdge({ id: `e-${source.id}-${newId}`, source: source.id, target: newId, animated: true }, e));
    }
    setModalOpen(false);
    setActiveSourceNodeId(null);
    if (source) setTimeout(() => fitView({ duration: 300, padding: 0.3, maxZoom: 1 }), 200);
  };

  return (
    <div ref={wrap} className="relative h-full flex-1">
      <AddContext.Provider value={openAdd}>
        <ReactFlow
          nodes={props.nodes} edges={props.edges} nodeTypes={nodeTypes}
          onNodesChange={props.onNodesChange} onEdgesChange={props.onEdgesChange} onConnect={onConnect}
          deleteKeyCode={["Backspace", "Delete"]} fitView className="bg-background"
        >
          <Background variant={BackgroundVariant.Dots} color="#333" gap={20} size={1.5} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </AddContext.Provider>
      {props.nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => openAdd(null)}
            aria-label="Add first node"
            className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card text-primary hover:border-primary"
          >
            <Plus className="h-9 w-9" strokeWidth={1.5} />
          </button>
          <p className="text-sm text-muted-foreground">Add your first step</p>
        </div>
      )}
      <NodePicker open={modalOpen} onClose={() => setModalOpen(false)} onPick={pick} />
    </div>
  );
}
