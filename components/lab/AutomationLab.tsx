"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Play, RotateCcw } from "lucide-react";
import { nodeCatalog, nodeMap, presetWorkflows, type NodeType } from "@/data/automationLab";
import { WorkflowNode, type NodeStatus } from "@/components/lab/WorkflowNode";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

type RunState = "idle" | "running" | "done";

export function AutomationLab() {
  const [activePreset, setActivePreset] = useState(presetWorkflows[0]!.id);
  const [customChain, setCustomChain] = useState<NodeType[]>([]);
  const [runState, setRunState] = useState<RunState>("idle");
  const [statuses, setStatuses] = useState<Record<number, NodeStatus>>({});
  const [log, setLog] = useState<string[]>([]);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const preset = presetWorkflows.find((p) => p.id === activePreset);
  const chain = customChain.length > 0 ? customChain : preset?.nodes ?? [];

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  function resetRun() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setRunState("idle");
    setStatuses({});
    setLog([]);
  }

  function selectPreset(id: string) {
    resetRun();
    setActivePreset(id);
    setCustomChain([]);
  }

  function addNode(id: NodeType) {
    resetRun();
    setCustomChain((prev) => [...prev, id]);
  }

  function clearCustom() {
    resetRun();
    setCustomChain([]);
  }

  function runWorkflow() {
    if (chain.length === 0) return;
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setRunState("running");
    setStatuses({});
    setLog([]);

    chain.forEach((nodeId, i) => {
      timeouts.current.push(
        setTimeout(() => {
          setStatuses((prev) => ({ ...prev, [i]: "processing" }));
          setLog((prev) => [...prev, `Processing: ${nodeMap[nodeId].label}`]);
        }, i * 850),
      );
      timeouts.current.push(
        setTimeout(() => {
          setStatuses((prev) => ({ ...prev, [i]: "completed" }));
          setLog((prev) => [...prev, `Completed: ${nodeMap[nodeId].label}`]);
          if (i === chain.length - 1) setRunState("done");
        }, i * 850 + 600),
      );
    });
  }

  return (
    <section id="solutions" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Automation Lab"
          title="Build the system."
          description="Select a preset workflow or assemble your own from the same building blocks we use for clients — then run it to see how the pieces connect."
        />

        <FadeIn delay={0.1} className="mt-10 flex flex-wrap gap-2">
          {presetWorkflows.map((wf) => (
            <button
              key={wf.id}
              onClick={() => selectPreset(wf.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activePreset === wf.id && customChain.length === 0
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-ink-600 bg-ink-900/60 text-mist-400 hover:border-ink-500 hover:text-paper-50",
              )}
            >
              {wf.name}
            </button>
          ))}
        </FadeIn>

        <FadeIn delay={0.15} className="mt-10 grid gap-6 lg:grid-cols-[1fr,1.1fr]">
          <div className="rounded-xl border border-ink-700 bg-ink-900/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-mist-500">
                Node Palette — click to add
              </p>
              {customChain.length > 0 && (
                <button onClick={clearCustom} className="text-xs text-mist-500 hover:text-paper-50">
                  Clear custom chain
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {nodeCatalog.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.id}
                    onClick={() => addNode(node.id)}
                    className="flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-950 px-3 py-1.5 text-xs text-mist-300 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {node.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-ink-700 pt-5">
              <p className="text-sm text-mist-400">
                {chain.length} node{chain.length === 1 ? "" : "s"} in workflow
              </p>
              <div className="flex items-center gap-2">
                {runState !== "idle" && (
                  <Button size="sm" variant="secondary" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={resetRun}>
                    Reset
                  </Button>
                )}
                <Button
                  size="sm"
                  icon={<Play className="h-3.5 w-3.5" />}
                  onClick={runWorkflow}
                  disabled={chain.length === 0 || runState === "running"}
                >
                  Run Workflow
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-ink-700 bg-ink-900/40 p-5">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-mist-500">
              Live Activity
            </p>
            <div className="scrollbar-thin h-32 overflow-y-auto rounded-lg border border-ink-700 bg-ink-950/60 p-3 font-mono text-xs">
              <AnimatePresence initial={false}>
                {log.length === 0 && <p className="text-mist-500">Run the workflow to see activity…</p>}
                {log.map((entry, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "py-0.5",
                      entry.startsWith("Completed") ? "text-signal-on" : "text-accent",
                    )}
                  >
                    {entry}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
            {runState === "done" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 font-mono text-xs uppercase tracking-wider text-signal-on"
              >
                Workflow complete — {chain.length}/{chain.length} steps executed
              </motion.p>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-8 overflow-x-auto rounded-xl border border-ink-700 bg-ink-900/40 p-6">
          <div className="flex min-w-max items-center gap-2">
            {chain.length === 0 && (
              <p className="text-sm text-mist-500">Select a preset or add nodes to see the workflow.</p>
            )}
            {chain.map((nodeId, i) => (
              <div key={`${nodeId}-${i}`} className="flex items-center gap-2">
                <WorkflowNode nodeId={nodeId} status={statuses[i] ?? "waiting"} />
                {i < chain.length - 1 && <ChevronRight className="h-4 w-4 shrink-0 text-ink-600" />}
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
