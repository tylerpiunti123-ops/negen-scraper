"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { industryOptions, type IndustryId } from "@/data/builderOptions";
import { industryPipelines } from "@/data/industryPipelines";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

export function IndustryExplorer() {
  const [active, setActive] = useState<IndustryId>("home-services");
  const pipeline = industryPipelines[active];
  const activeLabel = industryOptions.find((i) => i.id === active)?.label ?? "";

  return (
    <section id="industries" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Industries"
          title="Built around how your industry actually works."
          description="Select an industry to see how the automation sequence changes based on the way that business actually operates."
        />

        <FadeIn delay={0.1} className="mt-10 flex flex-wrap gap-2">
          {industryOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActive(opt.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active === opt.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-ink-600 bg-ink-900/60 text-mist-400 hover:border-ink-500 hover:text-paper-50",
              )}
            >
              {opt.label}
            </button>
          ))}
        </FadeIn>

        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/40 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{activeLabel}</p>
              <div className="mt-5 overflow-x-auto">
                <div className="flex min-w-max items-center gap-3">
                  {pipeline.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="rounded-lg border border-ink-600 bg-ink-950 px-4 py-3">
                        <span className="whitespace-nowrap text-sm font-medium text-paper-50">
                          {step}
                        </span>
                      </div>
                      {i < pipeline.length - 1 && (
                        <ArrowRight className="h-4 w-4 shrink-0 text-ink-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
