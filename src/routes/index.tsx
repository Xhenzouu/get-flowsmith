import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const WorkflowApp = lazy(() => import("@/components/workflow/WorkflowApp"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flowsmith — AI Workflow Builder" },
      { name: "description", content: "Design and simulate AI workflows with a drag-and-drop node canvas." },
      { property: "og:title", content: "Flowsmith — AI Workflow Builder" },
      { property: "og:description", content: "Design and simulate AI workflows with a drag-and-drop node canvas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const fallback = <div className="h-screen bg-background" />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <WorkflowApp />
      </Suspense>
    </ClientOnly>
  );
}
