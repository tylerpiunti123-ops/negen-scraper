"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { calculateROI, defaultROIInputs, type ROIInputs } from "@/lib/roiCalculations";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface FieldConfig {
  key: keyof ROIInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

const fields: FieldConfig[] = [
  { key: "monthlyLeads", label: "Monthly Leads", min: 10, max: 500, step: 5 },
  { key: "avgCustomerValue", label: "Average Customer Value", min: 100, max: 20000, step: 100, prefix: "$" },
  { key: "closeRate", label: "Current Close Rate", min: 5, max: 90, step: 1, suffix: "%" },
  { key: "missedCalls", label: "Missed Calls (per month)", min: 0, max: 150, step: 1 },
  { key: "avgFollowUpMinutes", label: "Avg. Follow-Up Time Per Lead", min: 1, max: 120, step: 1, suffix: " min" },
  { key: "employeesHandlingLeads", label: "Employees Handling Leads", min: 1, max: 20, step: 1 },
];

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>(defaultROIInputs);
  const results = useMemo(() => calculateROI(inputs), [inputs]);

  function updateField(key: keyof ROIInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section id="roi" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="ROI Calculator"
          title="What could this be worth to you?"
          description="Adjust the numbers to reflect your business and see the estimated opportunity in missed leads and manual hours."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr,1fr]">
          <FadeIn className="space-y-6 rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
            {fields.map((field) => (
              <div key={field.key}>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor={field.key} className="text-sm text-mist-400">
                    {field.label}
                  </label>
                  <span className="font-mono text-sm text-paper-50">
                    {field.prefix ?? ""}
                    {formatNumber(inputs[field.key])}
                    {field.suffix ?? ""}
                  </span>
                </div>
                <input
                  id={field.key}
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={inputs[field.key]}
                  onChange={(e) => updateField(field.key, Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-700 accent-accent"
                />
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.1} className="flex flex-col gap-4">
            <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                Estimated Opportunity You&apos;re Currently Missing
              </p>
              <p className="mt-2 flex items-baseline gap-2 text-4xl font-semibold text-paper-50 sm:text-5xl">
                <AnimatedCounter value={results.estimatedMissedValue} format={formatCurrency} />
                <span className="text-base font-normal text-mist-400">/ month</span>
              </p>
              <p className="mt-2 text-sm text-mist-400">
                ≈ {formatCurrency(results.estimatedMissedValue * 12)} per year at your current
                numbers — based on {formatNumber(results.estimatedMissedOpportunities)} missed
                opportunities/mo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="Estimated Missed Opportunities"
                value={<AnimatedCounter value={results.estimatedMissedOpportunities} suffix="/mo" />}
                sub={`≈ ${formatCurrency(results.estimatedMissedValue)} in estimated opportunity`}
              />
              <ResultCard
                label="Estimated Time Spent"
                value={<AnimatedCounter value={results.estimatedTimeSpentHours} suffix=" hrs/mo" />}
                sub="on manual lead follow-up"
              />
              <ResultCard
                label="Potential Recovered Opportunities"
                value={<AnimatedCounter value={results.potentialRecoveredOpportunities} suffix="/mo" />}
                sub={`≈ ${formatCurrency(results.potentialRecoveredValue)} in estimated opportunity`}
                accent
              />
              <ResultCard
                label="Potential Time Saved"
                value={<AnimatedCounter value={results.potentialTimeSavedHours} suffix=" hrs/mo" />}
                sub="freed up for your team"
                accent
              />
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
