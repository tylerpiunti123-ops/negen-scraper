"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Rocket, ThumbsUp } from "lucide-react";
import { campaignStages, sampleConversations } from "@/data/reactivationCampaign";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";

type Phase = "idle" | "running" | "done";

const TOTAL_CUSTOMERS = 1248;
const ELIGIBLE_CUSTOMERS = 312;
const RESPONSES = 47;
const INTERESTED = 12;

export function CustomerReactivationDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stageIndex, setStageIndex] = useState(-1);
  const [visibleConvos, setVisibleConvos] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  function launch() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setPhase("running");
    setStageIndex(-1);
    setVisibleConvos(0);

    campaignStages.forEach((_, i) => {
      timeouts.current.push(setTimeout(() => setStageIndex(i), 500 + i * 900));
    });

    sampleConversations.forEach((_, i) => {
      timeouts.current.push(
        setTimeout(() => setVisibleConvos(i + 1), 500 + campaignStages.length * 900 + i * 500),
      );
    });

    timeouts.current.push(
      setTimeout(
        () => setPhase("done"),
        500 + campaignStages.length * 900 + sampleConversations.length * 500 + 400,
      ),
    );
  }

  function reset() {
    timeouts.current.forEach(clearTimeout);
    setPhase("idle");
    setStageIndex(-1);
    setVisibleConvos(0);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink-700 bg-ink-900/60 px-5 py-3">
        <span className="font-medium text-paper-50">Customer Reactivation</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-mist-500">Customer Database</p>
              <p className="mt-1 text-2xl font-semibold text-paper-50">
                <AnimatedCounter value={TOTAL_CUSTOMERS} /> Past Customers
              </p>
            </div>
            <span className="rounded-full border border-ink-600 bg-ink-950 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-mist-400">
              Filter: No Job In Last 12 Months
            </span>
          </div>
          <p className="mt-3 text-sm text-mist-400">
            <span className="font-semibold text-accent">{ELIGIBLE_CUSTOMERS}</span> customers match
            this filter and are eligible for reactivation outreach.
          </p>
        </div>

        <div className="mt-5">
          {phase === "idle" && (
            <Button onClick={launch} icon={<Rocket className="h-4 w-4" />} className="w-full sm:w-auto">
              Launch Reactivation Campaign
            </Button>
          )}

          {phase !== "idle" && (
            <div className="grid gap-6 sm:grid-cols-[1fr,1.3fr]">
              <ul className="space-y-2">
                {campaignStages.map((stage, i) => {
                  const state = i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";
                  return (
                    <li key={stage.id} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                          state === "done" && "border-signal-on bg-signal-on/10 text-signal-on",
                          state === "active" && "border-accent bg-accent/10 text-accent",
                          state === "pending" && "border-ink-600 text-transparent",
                        )}
                      >
                        {state === "active" ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </span>
                      <span className={state === "pending" ? "text-mist-500" : "text-paper-50"}>
                        {stage.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {sampleConversations.slice(0, visibleConvos).map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-ink-700 bg-ink-900 p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-paper-50">{c.customer}</p>
                        {c.interested && (
                          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-signal-on">
                            <ThumbsUp className="h-3 w-3" /> Interested
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-mist-500">{c.lastService}</p>
                      <p className="mt-2 rounded-md bg-ink-950 p-2.5 text-xs leading-relaxed text-mist-400">
                        {c.outbound}
                      </p>
                      {c.reply && (
                        <p className="mt-1.5 rounded-md bg-accent/10 p-2.5 text-xs leading-relaxed text-paper-50">
                          {c.reply}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-signal-on/30 bg-signal-on/[0.06] p-4 text-center"
            >
              <div>
                <p className="text-lg font-semibold text-paper-50">
                  <AnimatedCounter value={ELIGIBLE_CUSTOMERS} />
                </p>
                <p className="text-[11px] text-mist-500">Messages Sent</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-paper-50">
                  <AnimatedCounter value={RESPONSES} />
                </p>
                <p className="text-[11px] text-mist-500">Responses</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-signal-on">
                  <AnimatedCounter value={INTERESTED} />
                </p>
                <p className="text-[11px] text-mist-500">Sent To Sales</p>
              </div>
              <div className="col-span-3 mt-1">
                <Button size="sm" variant="secondary" onClick={reset}>
                  Run Again
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
