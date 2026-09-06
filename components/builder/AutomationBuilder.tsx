"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { bottleneckOptions, industryOptions, type BottleneckId, type IndustryId } from "@/data/builderOptions";
import { buildAutomationMap } from "@/lib/automationBuilder";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

export function AutomationBuilder() {
  const [industry, setIndustry] = useState<IndustryId | null>(null);
  const [bottleneck, setBottleneck] = useState<BottleneckId | null>(null);
  const [result, setResult] = useState<ReturnType<typeof buildAutomationMap> | null>(null);

  function build() {
    if (!industry || !bottleneck) return;
    setResult(buildAutomationMap(industry, bottleneck));
  }

  function startOver() {
    setResult(null);
  }

  return (
    <section id="builder" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Personalized Automation Map"
          title="What would you automate?"
          description="Answer two questions and we'll generate a visual map of the system built for your industry and your biggest bottleneck."
        />

        {!result && (
          <FadeIn delay={0.1} className="mt-10 space-y-8">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-mist-500">
                1. What industry are you in?
              </p>
              <div className="flex flex-wrap gap-2">
                {industryOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setIndustry(opt.id)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      industry === opt.id
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-ink-600 bg-ink-900/60 text-mist-400 hover:border-ink-500 hover:text-paper-50",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {industry && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-mist-500">
                  2. What currently takes too much time?
                </p>
                <div className="flex flex-wrap gap-2">
                  {bottleneckOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBottleneck(opt.id)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        bottleneck === opt.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-ink-600 bg-ink-900/60 text-mist-400 hover:border-ink-500 hover:text-paper-50",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {industry && bottleneck && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Button onClick={build} icon={<Sparkles className="h-4 w-4" />} size="lg">
                  Build My Automation
                </Button>
              </motion.div>
            )}
          </FadeIn>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-2xl border border-ink-700 bg-ink-900/60 p-6 sm:p-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {result.industryLabel}
            </p>
            <p className="mt-1 text-sm text-mist-400">
              Automation map for: <span className="text-paper-50">{result.bottleneckLabel}</span>
            </p>

            <div className="mt-6 overflow-x-auto">
              <div className="flex min-w-max items-center gap-3">
                {result.steps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-950 px-4 py-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-[10px] text-accent">
                        {i + 1}
                      </span>
                      <span className="whitespace-nowrap text-sm font-medium text-paper-50">{step}</span>
                    </div>
                    {i < result.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-950/60 p-4">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-on" />
              <p className="text-sm leading-relaxed text-mist-400">{result.explanation}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="#contact" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                Build This For My Business
              </Button>
              <Button variant="secondary" size="lg" onClick={startOver}>
                Start Over
              </Button>
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
