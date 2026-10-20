import { Webhook, Clock, Sparkles, Database, Mail, Hourglass, GitBranch, Send, type LucideIcon } from "lucide-react";

export type Kind = "webhook" | "schedule" | "ai" | "database" | "email" | "delay" | "condition" | "action";

type Def = { label: string; icon: LucideIcon; border: string; text: string; outline: string; log: string; trigger?: boolean };

export const KINDS: Record<Kind, Def> = {
  webhook: { label: "Webhook", icon: Webhook, border: "border-t-node-webhook", text: "text-node-webhook", outline: "outline-node-webhook", log: "[Success] Webhook fired with payload", trigger: true },
  schedule: { label: "Schedule", icon: Clock, border: "border-t-node-schedule", text: "text-node-schedule", outline: "outline-node-schedule", log: "[Success] Schedule triggered on time", trigger: true },
  ai: { label: "AI Prompt", icon: Sparkles, border: "border-t-node-ai", text: "text-node-ai", outline: "outline-node-ai", log: "[Running] AI node processing prompt..." },
  database: { label: "Database", icon: Database, border: "border-t-node-database", text: "text-node-database", outline: "outline-node-database", log: "[Success] Database updated" },
  email: { label: "Send Email", icon: Mail, border: "border-t-node-email", text: "text-node-email", outline: "outline-node-email", log: "[Success] Email sent" },
  delay: { label: "Delay", icon: Hourglass, border: "border-t-node-delay", text: "text-node-delay", outline: "outline-node-delay", log: "[Success] Delay completed" },
  condition: { label: "Condition", icon: GitBranch, border: "border-t-node-condition", text: "text-node-condition", outline: "outline-node-condition", log: "[Success] Condition evaluated to true" },
  action: { label: "Action", icon: Send, border: "border-t-node-action", text: "text-node-action", outline: "outline-node-action", log: "[Success] Action node sent message" },
};

export const CATEGORIES: { title: string; kinds: Kind[] }[] = [
  { title: "Triggers", kinds: ["webhook", "schedule"] },
  { title: "AI & Data", kinds: ["ai", "database"] },
  { title: "Actions", kinds: ["email", "delay", "condition", "action"] },
];

const LEGACY: Record<string, Kind> = { trigger: "webhook" };
export function getKind(kind: string): Def {
  return KINDS[kind as Kind] ?? KINDS[LEGACY[kind]] ?? KINDS.action;
}
