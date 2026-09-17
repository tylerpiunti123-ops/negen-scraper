"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { GlossPanel } from "./shared/GlossPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Restrained wet-sanding showcase: a slow water sheen sweeps across a
 * glossy panel while a subtle scroll-linked "camera" parallax keeps the
 * section from feeling static.
 */
export function WetSandingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.03, 1, 1.03]);

  return (
    <section className="relative py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionHeading
          eyebrow="Wet Sanding"
          title="Leveling the surface, one pass at a time."
          description="Progressive-grit wet sanding removes deep defects and orange peel before machine polishing brings back full clarity."
        />

        <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <motion.div
            style={{ y: reducedMotion ? 0 : parallaxY, scale: reducedMotion ? 1 : scale }}
            className="absolute inset-0"
          >
            <GlossPanel variant="chrome" glossStrength={0.5} sweep={false} className="h-full w-full rounded-2xl">
              {!reducedMotion && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40" aria-hidden="true">
                  <div className="absolute -inset-y-1/2 left-0 w-1/2 animate-[sweep_7s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </div>
              )}
            </GlossPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
