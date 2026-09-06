import { ArrowUpRight, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { WorkflowVisualization } from "@/components/hero/WorkflowVisualization";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-ink-800 pb-20 pt-32 sm:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grain-surface opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-3xl"
      />
      <Container className="relative grid gap-16 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
        <div>
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-mist-400">
              AI Operations Infrastructure
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-paper-50 sm:text-5xl lg:text-[3.25rem]">
              Your business doesn&apos;t need more software.
              <br />
              It needs better systems.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-mist-400">
              We build AI-powered systems that capture leads, respond to customers, automate
              follow-up, and keep your business moving — without adding unnecessary manual work.
            </p>
          </FadeIn>
          <FadeIn delay={0.24} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#demos" size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
              Try AI Demos
            </Button>
            <Button href="#contact" variant="secondary" size="lg" icon={<PhoneCall className="h-4 w-4" />}>
              Book A Strategy Call
            </Button>
          </FadeIn>
          <FadeIn delay={0.32} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-mist-500">
            <span>No API key required to demo</span>
            <span className="hidden h-1 w-1 rounded-full bg-ink-600 sm:block" />
            <span>Built on your existing CRM &amp; phone system</span>
            <span className="hidden h-1 w-1 rounded-full bg-ink-600 sm:block" />
            <span>Live in weeks, not quarters</span>
          </FadeIn>
        </div>

        <FadeIn direction="left" delay={0.2}>
          <WorkflowVisualization />
        </FadeIn>
      </Container>
    </section>
  );
}
