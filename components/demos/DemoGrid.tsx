"use client";

import { useState } from "react";
import { demos, type DemoId } from "@/data/demos";
import { DemoCard } from "@/components/demos/DemoCard";
import { Modal } from "@/components/ui/Modal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { AIReceptionistDemo } from "@/components/demos/AIReceptionistDemo";
import { MissedCallRecoveryDemo } from "@/components/demos/MissedCallRecoveryDemo";
import { LeadFollowUpDemo } from "@/components/demos/LeadFollowUpDemo";
import { QuoteFollowUpDemo } from "@/components/demos/QuoteFollowUpDemo";
import { CustomerReactivationDemo } from "@/components/demos/CustomerReactivationDemo";

export function DemoGrid() {
  const [activeDemo, setActiveDemo] = useState<DemoId | null>(null);
  const activeMeta = demos.find((d) => d.id === activeDemo);

  return (
    <section id="demos" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="See It Work"
          title="Don't take our word for it."
          description="Interact with the systems before you ever talk to us. Every demo below runs the same logic we ship to clients."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        {activeDemo === "receptionist" && <AIReceptionistDemo onComplete={() => undefined} />}
        {activeDemo === "missed-call" && <MissedCallRecoveryDemo />}
        {activeDemo === "lead-followup" && <LeadFollowUpDemo />}
        {activeDemo === "quote-followup" && <QuoteFollowUpDemo />}
        {activeDemo === "reactivation" && <CustomerReactivationDemo />}
      </Modal>
    </section>
  );
}
