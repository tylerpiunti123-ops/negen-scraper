import { GlossPanel } from "./shared/GlossPanel";
import { CTAButton } from "./shared/CTAButton";
import { SectionHeading } from "./shared/DetailingSectionHeading";
import { detailingAssets } from "@/data/detailing/assets";

/**
 * Interactive paint correction panel. Faint swirl/scratch texture covers the
 * surface; moving the cursor across it reveals a "corrected" clean zone
 * around the pointer via a CSS mask driven by the same --mx/--my custom
 * properties GlossPanel sets for its specular highlight.
 */
export function PaintCorrectionSection() {
  return (
    <section id="paint-correction" className="relative py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionHeading
          eyebrow="Paint Correction"
          title="Move your cursor across the panel."
          description="Correction lifts swirls and haze out of the clear coat until the reflection is sharp enough to read a badge in."
        />

        <GlossPanel
          variant="black"
          glossStrength={1}
          videoSrc={detailingAssets.paintCorrectionVideo}
          posterSrc={detailingAssets.paintCorrectionPoster}
          imageAlt="Swirl marks under inspection light on a glossy panel"
          className="relative aspect-[4/3] w-full"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "repeating-linear-gradient(38deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, transparent 1px, transparent 6px), repeating-linear-gradient(-52deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 9px)",
              WebkitMaskImage:
                "radial-gradient(220px circle at var(--mx) var(--my), transparent 0%, transparent 30%, black 78%)",
              maskImage:
                "radial-gradient(220px circle at var(--mx) var(--my), transparent 0%, transparent 30%, black 78%)",
            }}
          />

          <div className="relative flex h-full flex-col justify-end p-6">
            <CTAButton href="#quote" variant="primary" className="w-fit">
              See What Your Vehicle Needs
            </CTAButton>
          </div>
        </GlossPanel>
      </div>
    </section>
  );
}
