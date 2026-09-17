"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { GlossPanel } from "./shared/GlossPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Parallax "mobile detailing" scene: the vehicle panel stays anchored while
 * the ambient backdrop and equipment accents drift at different speeds as
 * the section scrolls through view, creating depth without illustration.
 */
export function MobileDetailingScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const equipmentY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const glossX = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section id="mobile" ref={ref} className="relative overflow-hidden py-28">
      <motion.div aria-hidden style={{ y: reducedMotion ? 0 : bgY }} className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 20% 30%, rgba(195,20,50,0.1), transparent 60%), radial-gradient(60% 50% at 85% 70%, rgba(120,130,150,0.08), transparent 60%)",
          }}
        />
      </motion.div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionHeading
          eyebrow="Mobile Detailing"
          title="We bring the shop to your driveway."
          description="Full-service detailing on-site, with the same multi-stage process and equipment as our shop."
        />

        <div className="relative aspect-[4/3] w-full">
          <GlossPanel variant="black" glossStrength={0.7} className="absolute inset-0 z-10">
            <motion.div
              aria-hidden
              style={{ x: reducedMotion ? 0 : glossX }}
              className="pointer-events-none absolute inset-y-0 left-1/3 w-1/4 bg-white/5 blur-2xl"
            />
          </GlossPanel>

          <motion.div
            aria-hidden
            style={{ y: reducedMotion ? 0 : equipmentY }}
            className="absolute -bottom-6 -left-6 -z-10 h-24 w-24 rounded-xl border border-moto-line bg-moto-panel/80 shadow-panel"
          />
          <motion.div
            aria-hidden
            style={{ y: reducedMotion ? 0 : equipmentY }}
            className="absolute -right-4 -top-4 -z-10 h-16 w-16 rounded-full border border-moto-line bg-moto-panel/80 shadow-panel"
          />
        </div>
      </div>
    </section>
  );
}
