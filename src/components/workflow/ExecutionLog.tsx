import { AnimatePresence, motion } from "framer-motion";
import { X, Terminal } from "lucide-react";

export function ExecutionLog({ open, lines, onClose }: { open: boolean; lines: string[]; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed inset-x-0 bottom-0 z-20 h-56 border-t border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Terminal className="h-4 w-4 text-primary" strokeWidth={1.75} /> Execution Log
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close log">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[calc(100%-41px)] overflow-y-auto p-4 font-mono text-xs leading-6">
            {lines.map((l, i) => (
              <div key={i} className={l.startsWith("[Error]") ? "text-destructive" : l.startsWith("[Running]") ? "text-accent" : "text-success"}>
                {l}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
