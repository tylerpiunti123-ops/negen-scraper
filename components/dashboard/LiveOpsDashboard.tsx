"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity } from "lucide-react";
import { activityTemplates, dashboardMetrics } from "@/data/liveActivity";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FadeIn } from "@/components/ui/FadeIn";

interface FeedEntry {
  id: number;
  time: string;
  text: string;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function LiveOpsDashboard() {
  const reduceMotion = useReducedMotion();
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const seedNow = new Date();
    const seeded: FeedEntry[] = activityTemplates.slice(0, 5).map((text) => {
      counter.current += 1;
      return { id: counter.current, time: formatTime(seedNow), text };
    });
    setFeed(seeded.reverse());

    if (reduceMotion) return;

    const interval = setInterval(() => {
      counter.current += 1;
      const text = activityTemplates[Math.floor(Math.random() * activityTemplates.length)]!;
      const entry: FeedEntry = { id: counter.current, time: formatTime(new Date()), text };
      setFeed((prev) => [entry, ...prev].slice(0, 6));
    }, 3200);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <section className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Live Operations"
            title="Systems running in the background."
            description="A sample of what an active client dashboard looks like once a system is deployed."
            className="max-w-xl"
          />
          <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-900 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-mist-500">
            <Activity className="h-3 w-3" />
            Demo Data
          </span>
        </div>

        <FadeIn delay={0.1} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-ink-700 bg-ink-900/60 p-5">
              <p className="text-3xl font-semibold text-paper-50">
                <AnimatedCounter value={metric.value} />
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-mist-500">{metric.label}</p>
            </div>
          ))}
        </FadeIn>

        <FadeIn delay={0.18} className="mt-6 rounded-xl border border-ink-700 bg-ink-900/40 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-mist-500">Activity Feed</p>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-signal-on">
              <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-signal-on" />
              Live (Simulated)
            </span>
          </div>
          <ul className="h-[200px] space-y-2 overflow-hidden font-mono text-xs">
            <AnimatePresence initial={false}>
              {feed.map((entry) => (
                <motion.li
                  key={entry.id}
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 border-b border-ink-800 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="text-mist-500">{entry.time}</span>
                  <span className="text-paper-50/90">{entry.text}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </FadeIn>

        <p className="mt-3 text-xs text-mist-500">
          Data shown above is simulated for demonstration purposes and does not represent real
          client statistics.
        </p>
      </Container>
    </section>
  );
}
