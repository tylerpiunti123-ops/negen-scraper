"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Phone, Play, RotateCcw, Sparkles, Star } from "lucide-react";
import { aiSeoChecklist, aiSeoScenarios } from "@/data/aiSeoScenarios";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Phase = "idle" | "thinking" | "answering" | "recommending" | "done";

export function AiSeoDemo() {
  const [scenarioId, setScenarioId] = useState(aiSeoScenarios[0]!.id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepCount, setStepCount] = useState(0);
  const [checklistCount, setChecklistCount] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = aiSeoScenarios.find((s) => s.id === scenarioId) ?? aiSeoScenarios[0]!;

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  function reset() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setPhase("idle");
    setStepCount(0);
    setChecklistCount(0);
  }

  function selectScenario(id: string) {
    reset();
    setScenarioId(id);
  }

  function run() {
    reset();
    setPhase("thinking");

    timeouts.current.push(setTimeout(() => setPhase("answering"), 900));

    scenario.steps.forEach((_, i) => {
      timeouts.current.push(setTimeout(() => setStepCount(i + 1), 1100 + i * 650));
    });

    const afterSteps = 1100 + scenario.steps.length * 650;
    timeouts.current.push(setTimeout(() => setPhase("recommending"), afterSteps + 400));

    aiSeoChecklist.forEach((_, i) => {
      timeouts.current.push(
        setTimeout(() => setChecklistCount(i + 1), afterSteps + 1000 + i * 400),
      );
    });

    timeouts.current.push(
      setTimeout(() => setPhase("done"), afterSteps + 1000 + aiSeoChecklist.length * 400 + 300),
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-900/60 px-5 py-3">
        <span className="font-medium text-paper-50">AI SEO</span>
        {phase === "idle" ? (
          <Button size="sm" icon={<Play className="h-3.5 w-3.5" />} onClick={run}>
            Run Demo
          </Button>
        ) : (
          <Button size="sm" variant="secondary" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={reset}>
            Reset
          </Button>
        )}
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-5 flex flex-wrap gap-2">
          {aiSeoScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => selectScenario(s.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                scenarioId === s.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-ink-600 bg-ink-950 text-mist-400 hover:border-ink-500 hover:text-paper-50",
              )}
            >
              {s.industry}
            </button>
          ))}
        </div>

        {phase === "idle" && (
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-ink-600 text-center text-sm text-mist-500">
            <Sparkles className="mb-2 h-5 w-5" />
            Press &quot;Run Demo&quot; to see what happens when someone asks AI for help at 2am.
          </div>
        )}

        {phase !== "idle" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm leading-relaxed text-ink-950">
                {scenario.userQuestion}
              </div>
            </div>

            {phase === "thinking" && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-ink-700 bg-ink-900 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-blink rounded-full bg-mist-400"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {stepCount > 0 && (
              <div className="rounded-2xl rounded-bl-sm border border-ink-700 bg-ink-900 px-4 py-3.5">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-mist-500">
                  {scenario.aiLabel}
                </p>
                <ul className="space-y-2">
                  <AnimatePresence initial={false}>
                    {scenario.steps.slice(0, stepCount).map((step, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 text-sm leading-relaxed text-paper-50"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 font-mono text-[10px] text-accent">
                          {i + 1}
                        </span>
                        {step}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            )}

            <AnimatePresence>
              {(phase === "recommending" || phase === "done") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-accent/40 bg-accent/[0.07] p-4"
                >
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                    <Sparkles className="h-3 w-3" />
                    Recommended by AI — this is the spot
                  </p>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-paper-50">
                        {scenario.recommendation.businessName}
                      </p>
                      <p className="text-xs text-mist-400">{scenario.recommendation.service}</p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-mist-400">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {scenario.recommendation.rating} ({scenario.recommendation.reviewCount})
                        <span className="text-signal-on">
                          · {scenario.recommendation.availability}
                        </span>
                      </div>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-ink-950 text-accent">
                      <Phone className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {checklistCount > 0 && (
              <div className="rounded-xl border border-ink-700 bg-ink-950/60 p-4">
                <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-mist-500">
                  Why this business showed up
                </p>
                <ul className="space-y-2">
                  {aiSeoChecklist.map((item, i) => {
                    const visible = i < checklistCount;
                    return (
                      <li key={item} className="flex items-start gap-2.5 text-xs">
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                            visible
                              ? "border-signal-on bg-signal-on/10 text-signal-on"
                              : "border-ink-600 text-transparent",
                          )}
                        >
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span className={visible ? "text-mist-300" : "text-mist-600"}>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {phase === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button href="#contact" size="sm" className="mt-1 w-full sm:w-auto">
                  Get Your Business AI-SEO Optimized
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
