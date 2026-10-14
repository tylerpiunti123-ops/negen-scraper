"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { demos, type DemoId } from "@/data/demos";
import { DemoCard } from "@/components/demos/DemoCard";
import { Modal } from "@/components/ui/Modal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { AIReceptionistDemo } from "@/components/demos/AIReceptionistDemo";
import { MissedCallRecoveryDemo } from "@/components/demos/MissedCallRecoveryDemo";
import { LeadFollowUpDemo } from "@/components/demos/LeadFollowUpDemo";
import { QuoteFollowUpDemo } from "@/components/demos/QuoteFollowUpDemo";
import { CustomerReactivationDemo } from "@/components/demos/CustomerReactivationDemo";
import { AiSeoDemo } from "@/components/demos/AiSeoDemo";
import { AiAdsDemo } from "@/components/demos/AiAdsDemo";
import { DEFAULT_NICHE } from "@/lib/conversationEngine";

export function DemoGrid() {
  const [activeDemo, setActiveDemo] = useState<DemoId | null>(null);
  const [niche, setNiche] = useState(DEFAULT_NICHE);
  const activeMeta = demos.find((d) => d.id === activeDemo);
  const effectiveNiche = niche.trim() || DEFAULT_NICHE;

  return (
    <section id="demos" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="See It Work"
          title="Don't take our word for it."
          description="Interact with the systems before you ever talk to us. Every demo below runs the same logic we ship to clients."
        />

        <FadeIn
          delay={0.08}
          className="mt-8 flex flex-col gap-2 rounded-xl border border-ink-700 bg-ink-900/40 p-4 sm:flex-row sm:items-center sm:gap-3"
        >
          <label htmlFor="demo-niche" className="flex shrink-0 items-center gap-1.5 text-sm text-mist-400">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Run these demos for:
          </label>
          <input
            id="demo-niche"
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder={DEFAULT_NICHE}
            className="w-full max-w-xs rounded-lg border border-ink-600 bg-ink-950 px-3.5 py-2 text-sm text-paper-50 placeholder:text-mist-500 focus:border-accent focus:outline-none"
          />
          <span className="text-xs text-mist-500">
            Type your business or industry — every demo below updates to match.
          </span>
        </FadeIn>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo, i) => (
            <DemoCard key={demo.id} demo={demo} onOpen={setActiveDemo} delay={i * 0.06} />
          ))}
        </div>
      </Container>

      <Modal
        open={activeDemo !== null}
        onClose={() => setActiveDemo(null)}
        eyebrow={activeMeta ? `Demo ${activeMeta.index} — ${activeMeta.tagline}` : undefined}
        className="h-[85vh] sm:h-[640px]"
      >
        {activeDemo === "ai-seo" && <AiSeoDemo />}
        {activeDemo === "ai-ads" && <AiAdsDemo niche={effectiveNiche} />}
        {activeDemo === "receptionist" && (
          <AIReceptionistDemo niche={effectiveNiche} onComplete={() => undefined} />
        )}
        {activeDemo === "missed-call" && <MissedCallRecoveryDemo niche={effectiveNiche} />}
        {activeDemo === "lead-followup" && <LeadFollowUpDemo niche={effectiveNiche} />}
        {activeDemo === "quote-followup" && <QuoteFollowUpDemo niche={effectiveNiche} />}
        {activeDemo === "reactivation" && <CustomerReactivationDemo niche={effectiveNiche} />}
      </Modal>
    </section>
  );
}
