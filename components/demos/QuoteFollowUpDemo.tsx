"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Phase = "idle" | "detecting" | "generating" | "sent" | "done";

const followUpMessage =
  "Hey Mike, just checking in on the estimate we sent over. I wanted to make sure you had everything you needed and see if you had any questions about the project.";

const finishSteps = ["Follow-up sent", "CRM updated", "Next follow-up scheduled"];

export function QuoteFollowUpDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [finishedCount, setFinishedCount] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  function start() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setFinishedCount(0);
    setPhase("detecting");

    timeouts.current.push(setTimeout(() => setPhase("generating"), 1300));
    timeouts.current.push(setTimeout(() => setPhase("sent"), 2700));
    finishSteps.forEach((_, i) => {
      timeouts.current.push(
        setTimeout(
          () => {
            setFinishedCount(i + 1);
            if (i === finishSteps.length - 1) setPhase("done");
          },
          3400 + i * 650,
        ),
      );
    });
  }

  function reset() {
    timeouts.current.forEach(clearTimeout);
    setPhase("idle");
    setFinishedCount(0);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink-700 bg-ink-900/60 px-5 py-3">
        <span className="font-medium text-paper-50">Quote Follow-Up</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-mist-500">Customer</p>
              <p className="text-sm font-semibold text-paper-50">Mike Johnson</p>
            </div>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
              Quote Sent
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-ink-700 pt-4">
            <div>
              <p className="text-xs text-mist-500">Project</p>
              <p className="mt-1 text-sm text-paper-50">Garage Floor</p>
            </div>
            <div>
              <p className="text-xs text-mist-500">Quote</p>
              <p className="mt-1 text-sm text-paper-50">$4,850</p>
            </div>
            <div>
              <p className="text-xs text-mist-500">Days Since Quote</p>
              <p className="mt-1 text-sm font-semibold text-accent">4</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {phase === "idle" && (
            <Button onClick={start} icon={<Zap className="h-4 w-4" />} className="w-full sm:w-auto">
              Start AI Follow-Up
            </Button>
          )}

          <AnimatePresence mode="wait">
            {phase === "detecting" && (
              <motion.div
                key="detecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3 text-sm text-mist-400"
              >
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                Detecting stale quote…
              </motion.div>
            )}
            {phase === "generating" && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3 text-sm text-mist-400"
              >
                <Sparkles className="h-4 w-4 animate-spin text-accent" />
                Generating personalized follow-up…
              </motion.div>
            )}
          </AnimatePresence>

          {(phase === "sent" || phase === "done") && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-ink-700 bg-ink-900 p-4"
            >
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-mist-500">
                SMS to Mike Johnson
              </p>
              <p className="text-sm leading-relaxed text-paper-50">{followUpMessage}</p>
            </motion.div>
          )}

          {(phase === "sent" || phase === "done") && (
            <ul className="mt-4 space-y-2">
              {finishSteps.map((step, i) => {
                const isVisible = i < finishedCount;
                return (
                  <li key={step} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-300",
                        isVisible
                          ? "border-signal-on bg-signal-on/10 text-signal-on"
                          : "border-ink-600 text-transparent",
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span className={isVisible ? "text-paper-50" : "text-mist-500"}>{step}</span>
                  </li>
                );
              })}
            </ul>
          )}

          {phase === "done" && (
            <div className="mt-4 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wider text-signal-on">
                Quote follow-up complete
              </p>
              <Button size="sm" variant="secondary" onClick={reset}>
                Run Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
