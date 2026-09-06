"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PhoneMissed, Play, RotateCcw, Sparkles } from "lucide-react";
import { missedCallSequence } from "@/data/missedCallSequence";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Phase = "idle" | "running" | "done";

export function MissedCallRecoveryDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleCount, setVisibleCount] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  function runDemo() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setPhase("running");
    setVisibleCount(0);

    missedCallSequence.forEach((_, i) => {
      const t = setTimeout(
        () => {
          setVisibleCount(i + 1);
          if (i === missedCallSequence.length - 1) {
            setPhase("done");
          }
        },
        550 + i * 750,
      );
      timeouts.current.push(t);
    });
  }

  function reset() {
    timeouts.current.forEach(clearTimeout);
    setPhase("idle");
    setVisibleCount(0);
  }

  const messageEvents = missedCallSequence
    .slice(0, visibleCount)
    .filter((e) => e.type !== "check");
  const checkEvents = missedCallSequence.slice(0, visibleCount).filter((e) => e.type === "check");
  const totalChecks = missedCallSequence.filter((e) => e.type === "check").length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-900/60 px-5 py-3">
        <span className="font-medium text-paper-50">Missed Call Recovery</span>
        {phase === "idle" ? (
          <Button size="sm" icon={<Play className="h-3.5 w-3.5" />} onClick={runDemo}>
            Run Demo
          </Button>
        ) : (
          <Button size="sm" variant="secondary" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={reset}>
            Reset
          </Button>
        )}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-0 overflow-hidden sm:grid-cols-2">
        <div className="scrollbar-thin flex flex-col gap-3 overflow-y-auto border-b border-ink-700 bg-ink-950/40 px-5 py-5 sm:border-b-0 sm:border-r">
          {phase === "idle" && (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-mist-500">
              <PhoneMissed className="mb-3 h-6 w-6" />
              Press &quot;Run Demo&quot; to simulate an incoming missed call.
            </div>
          )}

          <AnimatePresence initial={false}>
            {messageEvents.map((event) => {
              if (event.type === "call") {
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/[0.08] px-4 py-3"
                  >
                    <div className="flex items-center gap-2 text-accent">
                      <PhoneMissed className="h-4 w-4" />
                      <span className="text-sm font-medium">{event.text}</span>
                    </div>
                    <span className="font-mono text-xs text-mist-500">{event.timestamp}</span>
                  </motion.div>
                );
              }
              if (event.type === "detect") {
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal-on"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {event.text}
                    <span className="ml-auto text-mist-500">{event.timestamp}</span>
                  </motion.div>
                );
              }
              const isOut = event.type === "sms-out";
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", isOut ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      isOut
                        ? "rounded-bl-sm border border-ink-700 bg-ink-900 text-paper-50"
                        : "rounded-br-sm bg-accent text-ink-950",
                    )}
                  >
                    {event.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 bg-ink-950/20 px-5 py-5">
          <p className="font-mono text-xs uppercase tracking-widest text-mist-500">
            Automation Checklist
          </p>
          <ul className="space-y-2.5">
            {missedCallSequence
              .filter((e) => e.type === "check")
              .map((event) => {
                const isVisible = checkEvents.some((c) => c.id === event.id);
                return (
                  <li key={event.id} className="flex items-center gap-2.5 text-sm">
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
                    <span className={isVisible ? "text-paper-50" : "text-mist-500"}>{event.text}</span>
                  </li>
                );
              })}
          </ul>

          <AnimatePresence>
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 rounded-lg border border-signal-on/30 bg-signal-on/[0.08] px-4 py-3 text-center"
              >
                <p className="font-mono text-sm font-semibold uppercase tracking-wider text-signal-on">
                  Lead Recovered
                </p>
                <p className="mt-1 text-xs text-mist-400">
                  {totalChecks}/{totalChecks} automation steps completed in under 4 minutes
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
