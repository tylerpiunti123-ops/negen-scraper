"use client";

import { ArrowRight } from "lucide-react";
import type { DemoMeta } from "@/data/demos";
import { FadeIn } from "@/components/ui/FadeIn";

interface DemoCardProps {
  demo: DemoMeta;
  onOpen: (id: DemoMeta["id"]) => void;
  delay?: number;
}

export function DemoCard({ demo, onOpen, delay = 0 }: DemoCardProps) {
  const Icon = demo.icon;
  return (
    <FadeIn delay={delay} className="h-full">
      <button
        onClick={() => onOpen(demo.id)}
        className="group flex h-full w-full flex-col items-start rounded-xl border border-ink-700 bg-ink-900/60 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-500 hover:bg-ink-850 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div className="flex w-full items-start justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-950 text-accent">
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-mono text-xs text-mist-500">{demo.index}</span>
        </div>
        <h3 className="mt-5 text-base font-semibold text-paper-50">{demo.title}</h3>
        <p className="mt-1 text-sm text-accent-light">{demo.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-mist-400">{demo.description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-paper-50">
          Run the demo
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </button>
    </FadeIn>
  );
}
