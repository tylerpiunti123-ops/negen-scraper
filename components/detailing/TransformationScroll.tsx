"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { PlaceholderSurface } from "./shared/PlaceholderSurface";
import { SectionHeading } from "./shared/DetailingSectionHeading";
import { detailingAssets } from "@/data/detailing/assets";

/**
 * Scroll-driven "dirty to polished" transformation. A single panel morphs
 * from blurred/dark/low-gloss to sharp/bright/glossy as the section scrolls
 * past, communicating transformation rather than illustrating two separate
 * photos.
 */
export function TransformationScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const blur = useTransform(scrollYProgress, [0, 0.6, 1], [10, 2, 0]);
  const brightness = useTransform(scrollYProgress, [0, 1], [0.55, 1.15]);
  const saturate = useTransform(scrollYProgress, [0, 1], [0.4, 1.2]);
  const filter = useTransform(
    [blur, brightness, saturate],
    ([b, br, s]) => `blur(${b}px) brightness(${br}) saturate(${s})`,
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const glossOpacity = useTransform(scrollYProgress, [0.4, 1], [0, 0.55]);
  const beforeBadgeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const afterBadgeOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-moto-carbon">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <SectionHeading
            eyebrow="Transformation"
            title="Watch neglect turn into a finish worth photographing."
            description="Keep scrolling — the same panel, correction applied in real time."
          />

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-moto-line shadow-gloss">
            <motion.div
              className="absolute inset-0"
              style={{
                filter: reducedMotion ? undefined : filter,
                scale: reducedMotion ? 1 : scale,
                y: reducedMotion ? 0 : parallaxY,
              }}
            >
              <PlaceholderSurface
                variant="black"
                src={detailingAssets.transformationBefore}
                alt="Oxidized red paint before correction"
                className="h-full w-full"
              />
            </motion.div>

            <motion.div
              aria-hidden
              style={{ opacity: reducedMotion ? 0.35 : glossOpacity }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent mix-blend-screen"
            />

            <motion.span
              style={{ opacity: reducedMotion ? 0.4 : beforeBadgeOpacity }}
              className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white"
            >
              Before
            </motion.span>
            <motion.span
              style={{ opacity: reducedMotion ? 1 : afterBadgeOpacity }}
              className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white"
            >
              After
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}
