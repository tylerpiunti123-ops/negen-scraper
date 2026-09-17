"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { PlaceholderSurface } from "./shared/PlaceholderSurface";
import { SectionHeading } from "./shared/DetailingSectionHeading";

/**
 * Scroll-linked headlight clarity reveal: a cloudy haze layer fades out and
 * brightness/contrast ramp up as the lens scrolls through the viewport,
 * finished with a light sweep once the lens reads as fully restored.
 */
export function HeadlightRestoration() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.3"] });

  const cloudOpacity = useTransform(scrollYProgress, [0, 1], [0.85, 0]);
  const filter = useTransform(scrollYProgress, (c) => `brightness(${0.7 + c * 0.5}) contrast(${0.8 + c * 0.3})`);
  const sweepX = useTransform(scrollYProgress, [0.6, 1], ["-120%", "140%"]);
  const sweepOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.95, 1], [0, 1, 1, 0]);

  return (
    <section className="relative py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionHeading
          eyebrow="Headlight Restoration"
          title="Cloudy to crystal, as you scroll."
          description="Progressive wet-sanding and polishing lift UV oxidation out of the lens for sharper light output at night."
        />

        <div
          ref={ref}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-moto-line shadow-gloss"
        >
          <motion.div className="absolute inset-0" style={{ filter: reducedMotion ? undefined : filter }}>
            <PlaceholderSurface variant="chrome" className="h-full w-full" />
          </motion.div>

          <motion.div
            aria-hidden
            style={{ opacity: reducedMotion ? 0 : cloudOpacity }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.5),rgba(200,200,200,0.25)_55%,transparent_80%)] backdrop-blur-[2px]"
          />

          {!reducedMotion && (
            <motion.div
              aria-hidden
              style={{ x: sweepX, opacity: sweepOpacity }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          )}
        </div>
      </div>
    </section>
  );
}
