"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { calculatorModes } from "@/lib/roiCalculations";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function ROICalculator() {
  const [modeId, setModeId] = useState(calculatorModes[0]!.id);
  const mode = useMemo(
    () => calculatorModes.find((m) => m.id === modeId) ?? calculatorModes[0]!,
    [modeId],
  );
  const [inputs, setInputs] = useState<Record<string, number>>(mode.defaults);
  const results = useMemo(() => mode.calculate(inputs), [mode, inputs]);

  function selectMode(id: string) {
    const next = calculatorModes.find((m) => m.id === id);
    if (!next) return;
    setModeId(id);
    setInputs(next.defaults);
  }

  function updateField(key: string, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section id="roi" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="ROI Calculator"
          title="What could this be worth to you?"
          description={mode.description}
        />

        <div className="mt-8 inline-flex rounded-full border border-ink-700 bg-ink-900/60 p-1">
          {calculatorModes.map((m) => (
            <button
              key={m.id}
              onClick={() => selectMode(m.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                m.id === mode.id
                  ? "bg-accent text-ink-950"
                  : "text-mist-400 hover:text-paper-50",
              )}
            >
              {m.tabLabel}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,1fr]">
          <FadeIn key={`${mode.id}-fields`} className="space-y-6 rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
            {mode.fields.map((field) => (
              <div key={field.key}>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor={field.key} className="text-sm text-mist-400">
                    {field.label}
                  </label>
                  <span className="font-mono text-sm text-paper-50">
                    {field.prefix ?? ""}
                    {formatNumber(inputs[field.key] ?? 0)}
                    {field.suffix ?? ""}
                  </span>
                </div>
                <input
                  id={field.key}
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={inputs[field.key] ?? 0}
                  onChange={(e) => updateField(field.key, Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-700 accent-accent"
                />
              </div>
            ))}
          </FadeIn>

          <FadeIn key={`${mode.id}-results`} delay={0.1} className="flex flex-col gap-4">
            <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {mode.heroLabel}
              </p>
              <p className="mt-2 flex items-baseline gap-2 text-4xl font-semibold text-paper-50 sm:text-5xl">
                <AnimatedCounter value={results[mode.heroValueKey] ?? 0} format={formatCurrency} />
                <span className="text-base font-normal text-mist-400">/ month</span>
              </p>
              <p className="mt-2 text-sm text-mist-400">{mode.heroSub(results)}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {mode.resultCards.map((card) => (
                <ResultCard
                  key={card.key}
                  label={card.label}
                  value={
                    <AnimatedCounter value={results[card.key] ?? 0} suffix={card.suffix ?? ""} />
                  }
                  sub={card.sub(results)}
                  accent={card.accent}
                />
              ))}
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-ink-700 bg-ink-900/40 p-4 text-xs leading-relaxed text-mist-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                Estimates are illustrative and will vary based on your business. These figures are
                not a guarantee of results — they&apos;re a starting point for the conversation.
              </p>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

function ResultCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-4">
      <p className="text-xs text-mist-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accent ? "text-accent" : "text-paper-50"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-mist-500">{sub}</p>
    </div>
  );
}
