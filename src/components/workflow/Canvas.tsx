import { useCallback, useRef, type DragEvent } from "react";
import ReactFlow, {
  Background, BackgroundVariant, Controls, Handle, Position, addEdge, useReactFlow,
  type Connection, type Edge, type Node, type NodeProps, type OnNodesChange, type OnEdgesChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { KINDS, type Kind } from "./nodeTypes";

type Data = { kind: Kind; active: boolean };

function FlowNode({ data, selected }: NodeProps<Data>) {
  const k = KINDS[data.kind];
  const Icon = k.icon;
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
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
const nodeTypes = { flow: FlowNode };

let id = 0;

export function Canvas(props: {
  nodes: Node<Data>[]; edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node<Data>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange; onEdgesChange: OnEdgesChange;
}) {
  const { screenToFlowPosition } = useReactFlow();
  const wrap = useRef<HTMLDivElement>(null);
  const onConnect = useCallback((c: Connection) => props.setEdges((e) => addEdge({ ...c, animated: true }, e)), [props]);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData("application/reactflow") as Kind;
    if (!kind) return;
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    props.setNodes((n) => n.concat({ id: `n${Date.now()}-${id++}`, type: "flow", position, data: { kind, active: false } }));
  };

  return (
    <div ref={wrap} className="h-full flex-1" onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={onDrop}>
      <ReactFlow
        nodes={props.nodes} edges={props.edges} nodeTypes={nodeTypes}
        onNodesChange={props.onNodesChange} onEdgesChange={props.onEdgesChange} onConnect={onConnect}
        deleteKeyCode={["Backspace", "Delete"]} fitView className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} color="#333" gap={20} size={1.5} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
