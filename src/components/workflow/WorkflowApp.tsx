import { useState } from "react";
import { ReactFlowProvider, useNodesState, useEdgesState, type Node, type Edge } from "reactflow";
import { Play, Trash2, Workflow } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "./Sidebar";
import { Canvas } from "./Canvas";
import { ExecutionLog } from "./ExecutionLog";
import { getKind, type Kind } from "./nodeTypes";

type Data = { kind: Kind; active: boolean };

const initialNodes: Node<Data>[] = [
  { id: "1", type: "flow", position: { x: 0, y: 100 }, data: { kind: "webhook", active: false } },
  { id: "2", type: "flow", position: { x: 260, y: 100 }, data: { kind: "ai", active: false } },
  { id: "3", type: "flow", position: { x: 520, y: 100 }, data: { kind: "condition", active: false } },
  { id: "4", type: "flow", position: { x: 780, y: 100 }, data: { kind: "action", active: false } },
];
const initialEdges: Edge[] = [
  { id: "e1", source: "1", target: "2", animated: true },
  { id: "e2", source: "2", target: "3", animated: true },
  { id: "e3", source: "3", target: "4", animated: true },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function WorkflowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Data>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const shown = nodes.map((n) => (n.data.active === (n.id === activeNodeId) ? n : { ...n, data: { ...n.data, active: n.id === activeNodeId } }));
  const log = (l: string) => setLines((p) => [...p, l]);

  const run = async () => {
    setLines([]);
    setLogOpen(true);
    setRunning(true);
    const triggers = nodes.filter((n) => getKind(n.data.kind).trigger);
    if (!triggers.length) {
      log("[Error] No Trigger node found. Add a Trigger to start the workflow.");
      toast.error("Run failed: no trigger node");
      setRunning(false);
      return;
    }
    const queue = triggers.map((t) => t.id);
    const seen = new Set<string>();
    while (queue.length) {
      const nid = queue.shift()!;
      if (seen.has(nid)) continue;
      seen.add(nid);
      const node = nodes.find((n) => n.id === nid);
      if (!node) continue;
      setActiveNodeId(nid);
      log(getKind(node.data.kind).log);
      await wait(1000);
      if (node.data.kind === "ai") log("[Success] AI node returned response");
      edges.filter((e) => e.source === nid).forEach((e) => queue.push(e.target));
    }
    setActiveNodeId(null);
    const skipped = nodes.length - seen.size;
    log(`[Success] Workflow completed — ${seen.size} node(s) executed${skipped ? `, ${skipped} unconnected skipped` : ""}`);
    toast.success("Workflow ran successfully");
    setRunning(false);
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-5">
          <div className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" strokeWidth={1.75} />
            <h1 className="text-xl">Flowsmith</h1>
          </div>
          <div className="flex gap-2">
            <button
              disabled={running}
              onClick={() => { setNodes([]); setEdges([]); setLines([]); }}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:border-accent hover:text-accent disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Clear Canvas
            </button>
            <button
              disabled={running}
              onClick={run}
              className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Play className="h-4 w-4" strokeWidth={2} /> {running ? "Running..." : "Run Workflow"}
            </button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <Canvas nodes={shown} edges={edges} setNodes={setNodes} setEdges={setEdges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} />
        </div>
        <ExecutionLog open={logOpen} lines={lines} onClose={() => setLogOpen(false)} />
        <Toaster theme="dark" toastOptions={{ className: "!bg-card !border-border !text-foreground" }} />
      </div>
    </ReactFlowProvider>
  );
}
