"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Play, RotateCcw, Target } from "lucide-react";
import {
  adMetrics,
  adPhases,
  buildAdCampaignGoal,
  buildAdTargeting,
  buildAdVariations,
  budgetReallocation,
} from "@/data/aiAdsCampaign";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DEFAULT_NICHE } from "@/lib/conversationEngine";
import { cn, formatCurrency } from "@/lib/utils";

type Phase = "idle" | "running" | "live";

export function AiAdsDemo({ niche = DEFAULT_NICHE }: { niche?: string }) {
  const adCampaignGoal = useMemo(() => buildAdCampaignGoal(niche), [niche]);
  const adVariations = useMemo(() => buildAdVariations(niche), [niche]);
  const adTargeting = useMemo(() => buildAdTargeting(niche), [niche]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  function reset() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setPhase("idle");
    setPhaseIndex(-1);
    setShowResults(false);
  }

  function run() {
    reset();
    setPhase("running");

    adPhases.forEach((_, i) => {
      timeouts.current.push(setTimeout(() => setPhaseIndex(i), 500 + i * 1000));
    });

    const launchAt = 500 + adPhases.length * 1000;
    timeouts.current.push(setTimeout(() => setPhase("live"), launchAt));
    timeouts.current.push(setTimeout(() => setShowResults(true), launchAt + 900));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-900/60 px-5 py-3">
        <span className="font-medium text-paper-50">AI Ad Manager</span>
        {phase === "idle" ? (
          <Button size="sm" icon={<Play className="h-3.5 w-3.5" />} onClick={run}>
            Generate Campaign
          </Button>
        ) : (
          <Button size="sm" variant="secondary" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={reset}>
            Reset
          </Button>
        )}
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-5 flex items-center justify-between rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm text-paper-50">{adCampaignGoal}</span>
          </div>
          {phase === "live" && <StatusBadge status="online" label="Live" pulse />}
        </div>

        {phase === "idle" && (
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-ink-600 text-center text-sm text-mist-500">
            Press &quot;Generate Campaign&quot; to see the AI write, target, and launch ads.
          </div>
        )}

        {phase !== "idle" && (
          <div className="space-y-5">
            <ul className="space-y-2">
              {adPhases.map((label, i) => {
                const state = i < phaseIndex || phase === "live" ? "done" : i === phaseIndex ? "active" : "pending";
                return (
                  <li key={label} className="flex items-center gap-2.5 text-sm">
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
                    <span className={state === "pending" ? "text-mist-500" : "text-paper-50"}>{label}</span>
                  </li>
                );
              })}
            </ul>

            {phaseIndex >= 1 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {adVariations.map((ad, i) => {
                  const Icon = ad.icon;
                  return (
                    <motion.div
                      key={ad.platform}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-lg border border-ink-700 bg-ink-900 p-3.5"
                    >
                      <div className="mb-2 flex items-center gap-1.5 text-mist-500">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="font-mono text-[10px] uppercase tracking-wider">
                          {ad.platform}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-paper-50">{ad.headline}</p>
                      <p className="mt-1 text-xs leading-relaxed text-mist-400">{ad.body}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {phaseIndex >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
                {adTargeting.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink-600 bg-ink-950 px-3 py-1.5 text-xs text-mist-300"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            <AnimatePresence>
              {showResults && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div>
                    <p className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-mist-500">
                      Performance — Last 7 Days
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {adMetrics.map((m) => (
                        <div key={m.label} className="rounded-lg border border-ink-700 bg-ink-900/60 p-3">
                          <p className="text-lg font-semibold text-paper-50">
                            <AnimatedCounter
                              value={m.value}
                              format={m.isCurrency ? formatCurrency : undefined}
                            />
                          </p>
                          <p className="text-[11px] text-mist-500">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-mist-500">
                      AI Reallocated Budget To What&apos;s Converting
                    </p>
                    <div className="space-y-3">
                      {budgetReallocation.map((b) => (
                        <div key={b.platform}>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-mist-400">{b.platform}</span>
                            <span className="font-mono text-mist-500">
                              {b.before}% <span className="text-accent">→ {b.after}%</span>
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-ink-800">
                            <motion.div
                              initial={{ width: `${b.before}%` }}
                              animate={{ width: `${b.after}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full rounded-full bg-accent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
