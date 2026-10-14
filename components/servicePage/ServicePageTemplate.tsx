import Link from "next/link";
import { ArrowRight, Check, Info, PhoneCall } from "lucide-react";
import type { ServicePageContent } from "@/data/servicePages";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export function ServicePageTemplate({ content }: { content: ServicePageContent }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.title,
    serviceType: content.title,
    description: content.metaDescription,
    provider: {
      "@type": "Organization",
      name: "NextGen Closers AI",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="pt-32 sm:pt-40">
        <section className="border-b border-ink-800 pb-16 sm:pb-20">
          <Container>
            <FadeIn>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {content.eyebrow}
              </p>
              <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold leading-tight text-paper-50 sm:text-5xl">
                {content.title}
              </h1>
              <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-mist-400">
                {content.subtitle}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={`/#demos`} size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                  Try The Live Demo
                </Button>
                <Button href="/#contact" variant="secondary" size="lg" icon={<PhoneCall className="h-4 w-4" />}>
                  Book A Strategy Call
                </Button>
              </div>
            </FadeIn>
          </Container>
        </section>

        <section className="border-b border-ink-800 py-16 sm:py-20">
          <Container className="max-w-3xl">
            <FadeIn>
              <h2 className="text-2xl font-semibold text-paper-50">What it is</h2>
              <p className="mt-4 text-base leading-relaxed text-mist-400">{content.whatItIs}</p>
            </FadeIn>

            <FadeIn delay={0.08} className="mt-12">
              <h2 className="text-2xl font-semibold text-paper-50">Who it&apos;s for</h2>
              <ul className="mt-4 space-y-3">
                {content.whoItsFor.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-mist-400">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-signal-on" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.16} className="mt-12">
              <h2 className="text-2xl font-semibold text-paper-50">How it works</h2>
              <ol className="mt-4 space-y-3">
                {content.howItWorks.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-base leading-relaxed text-mist-400">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs text-accent">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </FadeIn>

            <FadeIn delay={0.24} className="mt-12">
              <h2 className="text-2xl font-semibold text-paper-50">What it costs</h2>
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-900/40 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" />
                <p className="text-sm leading-relaxed text-mist-400">{content.costNote}</p>
              </div>
            </FadeIn>
          </Container>
        </section>

        <section className="border-b border-ink-800 py-16 sm:py-20">
          <Container className="max-w-3xl text-center">
            <FadeIn>
              <h2 className="text-balance text-2xl font-semibold text-paper-50 sm:text-3xl">
                See the {content.demoLabel} demo before you talk to us.
              </h2>
              <p className="mt-3 text-base text-mist-400">
                It runs the same logic we ship to clients — no sales call required to try it.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/#demos" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                  Try The Live Demo
                </Button>
                <Button href="/#builder" variant="secondary" size="lg">
                  Build My Automation Map
                </Button>
              </div>
              <p className="mt-6 text-sm text-mist-500">
                <Link href="/" className="underline hover:text-paper-50">
                  ← Back to all systems
                </Link>
              </p>
            </FadeIn>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
