"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Circle, Loader2 } from "lucide-react";
import { pipelineLog, pipelineNodes } from "@/data/heroPipeline";
import { cn } from "@/lib/utils";

const STEP_MS = 1500;

export function WorkflowVisualization() {
  const reduceMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState(0);
  const [logIndex, setLogIndex] = useState(reduceMotion ? pipelineLog.length : 0);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = setInterval(() => {
      setLogIndex((prev) => {
        const next = prev + 1;
        if (next > pipelineLog.length) {
          setActiveNode(0);
          return 0;
        }
        return next;
      });
    }, STEP_MS);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const nodeForLog = Math.min(logIndex, pipelineNodes.length - 1);
    setActiveNode(nodeForLog);
  }, [logIndex, reduceMotion]);

  return (
    <div className="w-full rounded-2xl border border-ink-600 bg-ink-900/80 p-5 shadow-panel sm:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-ink-700 pb-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist-500">
            Live System View
          </p>
          <p className="mt-0.5 text-sm font-medium text-paper-50">Lead-to-Appointment Pipeline</p>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-signal-on">
          <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-signal-on" />
          Running
        </span>
      </div>

      <div className="flex flex-col gap-0">
        {pipelineNodes.map((node, i) => {
          const isActive = i === activeNode && logIndex <= pipelineNodes.length;
          const completed = i < activeNode || (i === activeNode && logIndex >= pipelineNodes.length);
          return (
            <div key={node.id} className="flex items-stretch gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                    completed
                      ? "border-signal-on bg-signal-on/10 text-signal-on"
                      : isActive
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-ink-600 bg-ink-850 text-mist-500",
                  )}
                >
                  {completed ? (
                    <Check className="h-4 w-4" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Circle className="h-2 w-2 fill-current" />
                  )}
                </div>
                {i < pipelineNodes.length - 1 && (
                  <div
                    className={cn(
                      "my-1 w-px flex-1 transition-colors duration-300",
                      i < activeNode ? "bg-signal-on/50" : "bg-ink-700",
                    )}
                  />
                )}
              </div>
              <div className={cn("pb-6", i === pipelineNodes.length - 1 && "pb-1")}>
                <p
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    completed || isActive ? "text-paper-50" : "text-mist-500",
                  )}
                >
                  {node.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 rounded-lg border border-ink-700 bg-ink-950/60 p-4 font-mono text-xs">
        <p className="mb-2 uppercase tracking-widest text-mist-500">System Log</p>
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {pipelineLog.slice(0, logIndex).map((entry) => (
              <motion.li
                key={entry.id}
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-signal-on"
              >
                <Check className="h-3 w-3" />
                <span className="text-paper-50/90">{entry.text}</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {logIndex === 0 && <li className="text-mist-500">Waiting for next lead…</li>}
        </ul>
      </div>
    </div>
  );
}
