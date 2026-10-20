import { Zap, Sparkles, GitBranch, Send, type LucideIcon } from "lucide-react";

export type Kind = "trigger" | "ai" | "condition" | "action";

export const KINDS: Record<Kind, { label: string; icon: LucideIcon; border: string; text: string; outline: string; log: string }> = {
  trigger: { label: "Trigger", icon: Zap, border: "border-t-node-trigger", text: "text-node-trigger", outline: "outline-node-trigger", log: "[Success] Trigger node fired with payload" },
  ai: { label: "AI Prompt", icon: Sparkles, border: "border-t-node-ai", text: "text-node-ai", outline: "outline-node-ai", log: "[Running] AI node processing prompt..." },
  condition: { label: "Condition", icon: GitBranch, border: "border-t-node-condition", text: "text-node-condition", outline: "outline-node-condition", log: "[Success] Condition evaluated to true" },
  action: { label: "Action", icon: Send, border: "border-t-node-action", text: "text-node-action", outline: "outline-node-action", log: "[Success] Action node sent message" },
};
