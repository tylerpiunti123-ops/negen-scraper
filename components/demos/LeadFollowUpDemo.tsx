"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Clock } from "lucide-react";
import { followUpTimeline, pipelineStages } from "@/data/leadFollowUpTimeline";
import { cn } from "@/lib/utils";

export function LeadFollowUpDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = followUpTimeline[activeIndex] ?? followUpTimeline[0]!;
  const activeStageIdx = pipelineStages.indexOf(activeStep.stage);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink-700 bg-ink-900/60 px-5 py-3">
        <span className="font-medium text-paper-50">Lead Follow-Up Pipeline</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-6 grid grid-cols-5 gap-1.5 sm:gap-2">
          {pipelineStages.map((stage, i) => (
            <div key={stage} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors duration-300",
                  i <= activeStageIdx ? "bg-accent" : "bg-ink-700",
                )}
              />
              <span
                className={cn(
                  "text-center font-mono text-[9px] uppercase tracking-wider sm:text-[10px]",
                  i <= activeStageIdx ? "text-paper-50" : "text-mist-500",
                )}
              >
                {stage}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-xl border border-ink-700 bg-ink-900/60 p-4">
          <p className="text-xs text-mist-500">Lead</p>
          <p className="mt-1 text-sm font-semibold text-paper-50">Jordan Ellis — Kitchen Remodel</p>
          <p className="mt-0.5 text-xs text-mist-400">Currently in stage: {activeStep.stage}</p>
        </div>

        <div className="relative flex flex-col gap-1 pl-1">
          {followUpTimeline.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex items-start gap-4 rounded-lg px-3 py-3 text-left transition-colors",
                i === activeIndex ? "bg-ink-850" : "hover:bg-ink-900/60",
              )}
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]",
                    i === activeIndex
                      ? "border-accent bg-accent/10 text-accent"
                      : i < activeIndex
                        ? "border-signal-on bg-signal-on/10 text-signal-on"
                        : "border-ink-600 text-mist-500",
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                </span>
                {i < followUpTimeline.length - 1 && <div className="my-1 h-full w-px bg-ink-700" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-mist-500">
                    {step.timeLabel}
                  </span>
                  <span className="text-sm font-medium text-paper-50">{step.title}</span>
                </div>
                {i === activeIndex && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-start gap-2 rounded-lg border border-ink-700 bg-ink-950 p-3"
                  >
                    <Bot className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <p className="text-sm leading-relaxed text-mist-400">{step.message}</p>
                  </motion.div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
