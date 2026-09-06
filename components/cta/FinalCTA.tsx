import { ArrowRight, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-b border-ink-800 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-3xl"
      />
      <Container className="relative text-center">
        <FadeIn className="mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold leading-tight text-paper-50 sm:text-4xl lg:text-5xl">
            Let&apos;s find the bottleneck.
          </h2>
          <p className="mt-5 text-balance text-lg leading-relaxed text-mist-400">
            Tell us what currently takes too much time, and we&apos;ll show you where automation
            can fit.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#builder" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
              Build My Automation
            </Button>
            <Button href="#contact" variant="secondary" size="lg" icon={<PhoneCall className="h-4 w-4" />}>
              Book A Strategy Call
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
