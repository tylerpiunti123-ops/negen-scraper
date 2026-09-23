"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { CTAButton } from "./shared/CTAButton";
import { GlossPanel } from "./shared/GlossPanel";
import { FadeIn } from "@/components/ui/FadeIn";
import { detailingAssets } from "@/data/detailing/assets";

/**
 * Immersive hero vehicle experience. On fine-pointer devices the panel
 * rotates/pans with the cursor and the backdrop drifts in the opposite
 * direction for depth; on touch devices the same rotation is instead driven
 * by scroll position. Swap GlossPanel's `imageSrc` for a real vehicle photo
 * once available — the tilt/parallax/gloss logic needs no changes.
 */
export function Hero3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsFinePointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reducedMotion || !isFinePointer) return;
    const el = sectionRef.current;
    if (!el) return;
    function handleMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      px.set((e.clientX - rect.left) / rect.width);
      py.set((e.clientY - rect.top) / rect.height);
    }
    el.addEventListener("pointermove", handleMove);
    return () => el.removeEventListener("pointermove", handleMove);
  }, [reducedMotion, isFinePointer, px, py]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const pointerRotateY = useTransform(springX, [0, 1], [-10, 10]);
  const pointerRotateX = useTransform(springY, [0, 1], [8, -8]);
  const bgParallaxX = useTransform(springX, [0, 1], [10, -10]);
  const bgParallaxY = useTransform(springY, [0, 1], [6, -6]);
  const reflectionParallaxX = useTransform(springX, [0, 1], [-14, 14]);

  const scrollRotateY = useTransform(scrollYProgress, [0, 1], [0, 14]);
  const scrollTranslateY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const rotateY = isFinePointer ? pointerRotateY : scrollRotateY;
  const rotateX = isFinePointer ? pointerRotateX : 0;
  const translateY = isFinePointer ? 0 : scrollTranslateY;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-moto-black"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          x: reducedMotion ? 0 : bgParallaxX,
          y: reducedMotion ? 0 : bgParallaxY,
          background:
            "radial-gradient(60% 50% at 30% 20%, rgba(195,20,50,0.16), transparent 60%), radial-gradient(50% 40% at 80% 70%, rgba(120,130,150,0.1), transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 grain-surface opacity-[0.15]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 pt-28 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-24">
        <FadeIn>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-moto-redlight">
            Paint Correction · Ceramic Coating · Mobile Detailing
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-paper-50 sm:text-5xl lg:text-6xl">
            Detailing that looks like it belongs in a showroom.
          </h1>
          <p className="mt-5 max-w-md text-balance text-base leading-relaxed text-mist-400">
            Precision paint correction and ceramic coating engineered for a deep, glossy finish —
            delivered in-shop or at your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href="#quote" variant="primary">
              Get A Quote
            </CTAButton>
            <CTAButton href="#before-after" variant="secondary">
              See The Results
            </CTAButton>
          </div>
        </FadeIn>

        <div style={{ perspective: 1400 }} className="relative">
          <motion.div
            style={{
              rotateY: reducedMotion ? 0 : rotateY,
              rotateX: reducedMotion ? 0 : rotateX,
              y: reducedMotion ? 0 : translateY,
              transformStyle: "preserve-3d",
            }}
            className="relative"
          >
            <GlossPanel
              variant="black"
              glossStrength={0.85}
              imageSrc={detailingAssets.hero}
              imageAlt="Freshly detailed truck, glossy black paint"
              className="aspect-[4/3] w-full shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85)]"
            >
              <div className="flex h-full items-end p-6">
                <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                  Full Correction · Ceramic Finish
                </span>
              </div>
            </GlossPanel>

            <motion.div
              aria-hidden
              style={{ x: reducedMotion ? 0 : reflectionParallaxX }}
              className="absolute -bottom-8 -right-6 -z-10 hidden aspect-[4/3] w-[85%] rounded-2xl bg-moto-red/10 blur-2xl sm:block"
            />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-moto-black to-transparent" />
    </section>
  );
}
