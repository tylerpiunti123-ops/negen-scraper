import Link from "next/link";
import { AlertTriangle, ArrowRight, Info, PhoneCall } from "lucide-react";
import type { NichePageContent } from "@/data/nichePages";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export function NichePageTemplate({ content }: { content: NichePageContent }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.title,
    serviceType: "AI business automation",
    description: content.metaDescription,
    provider: {
      "@type": "Organization",
      name: "NextGen Closers AI",
    },
    audience: {
      "@type": "Audience",
      audienceType: content.niche,
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
                For {content.niche} Companies
              </p>
              <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold leading-tight text-paper-50 sm:text-5xl">
                {content.title}
              </h1>
              <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-mist-400">
                {content.subtitle}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/#builder" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                  Build My Automation Map
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
              <p className="text-base leading-relaxed text-mist-400">{content.whatItIs}</p>
            </FadeIn>

            <FadeIn delay={0.08} className="mt-12">
              <h2 className="text-2xl font-semibold text-paper-50">
                Where {content.niche.toLowerCase()} businesses actually lose leads
              </h2>
              <ul className="mt-4 space-y-3">
                {content.bottlenecks.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-mist-400">
                    <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </Container>
        </section>

        <section className="border-b border-ink-800 py-16 sm:py-20">
          <Container>
            <FadeIn>
              <h2 className="text-2xl font-semibold text-paper-50">
                What we build for {content.niche.toLowerCase()} companies
              </h2>
            </FadeIn>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.systems.map((system, i) => (
                <FadeIn key={system.label} delay={i * 0.06}>
                  <div className="h-full rounded-xl border border-ink-700 bg-ink-900/60 p-5">
                    <p className="text-base font-semibold text-paper-50">{system.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-mist-400">{system.description}</p>
                    {system.demoId && (
                      <Link
                        href="/#demos"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-light"
                      >
                        See it work
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-ink-800 py-16 sm:py-20">
          <Container className="max-w-3xl">
            <FadeIn>
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

            <FadeIn delay={0.08} className="mt-12">
              <h2 className="text-2xl font-semibold text-paper-50">What it costs</h2>
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-900/40 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" />
                <p className="text-sm leading-relaxed text-mist-400">{content.costNote}</p>
              </div>
            </FadeIn>
          </Container>
        </section>

        <section className="py-16 sm:py-20">
          <Container className="max-w-3xl text-center">
            <FadeIn>
              <h2 className="text-balance text-2xl font-semibold text-paper-50 sm:text-3xl">
                See it built for a {content.niche.toLowerCase()} business.
              </h2>
              <p className="mt-3 text-base text-mist-400">
                Run the live demos, or tell us what&apos;s taking too much time and we&apos;ll map it out.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/#demos" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                  Try The Live Demos
                </Button>
                <Button href="/#contact" variant="secondary" size="lg">
                  Book A Strategy Call
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
