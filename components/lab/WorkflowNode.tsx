"use client";

import { Check, Loader2 } from "lucide-react";
import type { NodeType } from "@/data/automationLab";
import { nodeMap } from "@/data/automationLab";
import { cn } from "@/lib/utils";

export type NodeStatus = "waiting" | "processing" | "completed";

export function WorkflowNode({
  nodeId,
  status = "waiting",
}: {
  nodeId: NodeType;
  status?: NodeStatus;
}) {
  const node = nodeMap[nodeId];
  const Icon = node.icon;

  return (
    <div
      className={cn(
        "flex min-w-[128px] flex-col items-center gap-2 rounded-xl border px-4 py-3.5 transition-colors duration-300",
        status === "completed" && "border-signal-on bg-signal-on/[0.08]",
        status === "processing" && "border-accent bg-accent/[0.08]",
        status === "waiting" && "border-ink-600 bg-ink-900/60",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border",
          status === "completed" && "border-signal-on/40 text-signal-on",
          status === "processing" && "border-accent/40 text-accent",
          status === "waiting" && "border-ink-600 text-mist-500",
        )}
      >
        {status === "processing" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "completed" ? (
          <Check className="h-4 w-4" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
      </div>
      <span
        className={cn(
          "text-center text-xs font-medium leading-tight",
          status === "waiting" ? "text-mist-400" : "text-paper-50",
        )}
      >
        {node.label}
      </span>
    </div>
  );
}
