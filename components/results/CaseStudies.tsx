import { caseStudies, caseStudiesNote } from "@/data/caseStudies";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export function CaseStudies() {
  return (
    <section id="results" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Results"
          title="Structured to show real outcomes, not just claims."
          description="Case studies below use a placeholder structure and will be updated with real client data as engagements complete."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study, i) => (
            <FadeIn key={study.industry} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col rounded-xl border border-ink-700 bg-ink-900/60 p-6">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  {study.industry}
                </span>

                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-wider text-mist-500">The Problem</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-400">{study.problem}</p>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-wider text-mist-500">The System</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {study.system.map((piece) => (
                      <span
                        key={piece}
                        className="rounded-full border border-ink-600 bg-ink-950 px-2.5 py-1 text-xs text-paper-50"
                      >
                        {piece}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-ink-700 pt-4">
                  <p className="text-[11px] uppercase tracking-wider text-mist-500">The Result</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper-50">{study.result}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <p className="mt-6 text-xs text-mist-500">{caseStudiesNote}</p>
      </Container>
    </section>
  );
}
