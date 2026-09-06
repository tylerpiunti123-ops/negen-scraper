"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { processSteps } from "@/data/processSteps";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="A four-stage process, not a subscription to a black box."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-4">
          {processSteps.map((step, i) => (
            <FadeIn key={step.index} delay={i * 0.06}>
              <button
                onClick={() => setActive(i)}
                className={cn(
                  "w-full rounded-xl border p-5 text-left transition-colors duration-200",
                  active === i
                    ? "border-accent bg-accent/[0.06]"
                    : "border-ink-700 bg-ink-900/60 hover:border-ink-500",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs",
                    active === i ? "text-accent" : "text-mist-500",
                  )}
                >
                  {step.index}
                </span>
                <p className="mt-2 text-base font-semibold text-paper-50">{step.title}</p>
                <p className="mt-1 text-sm text-mist-400">{step.summary}</p>
              </button>
            </FadeIn>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-ink-700 bg-ink-900/40 p-6"
        >
          <p className="text-sm leading-relaxed text-mist-400">{processSteps[active]!.detail}</p>
        </motion.div>
      </Container>
    </section>
  );
}
