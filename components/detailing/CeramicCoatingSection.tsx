"use client";

import { useReducedMotion } from "framer-motion";
import { GlossPanel } from "./shared/GlossPanel";
import { SectionHeading } from "./shared/DetailingSectionHeading";
import { CTAButton } from "./shared/CTAButton";
import { detailingAssets } from "@/data/detailing/assets";

interface Droplet {
  left: string;
  size: number;
  delay: number;
  duration: number;
  fall: number;
}

const droplets: Droplet[] = [
  { left: "6%", size: 10, delay: 0, duration: 5.2, fall: 340 },
  { left: "16%", size: 6, delay: 1.4, duration: 4.4, fall: 300 },
  { left: "25%", size: 14, delay: 0.6, duration: 6.1, fall: 400 },
  { left: "34%", size: 8, delay: 2.2, duration: 5.6, fall: 360 },
  { left: "44%", size: 5, delay: 0.2, duration: 4.8, fall: 280 },
  { left: "53%", size: 12, delay: 3.0, duration: 5.9, fall: 390 },
  { left: "62%", size: 7, delay: 1.0, duration: 4.6, fall: 310 },
  { left: "71%", size: 16, delay: 2.6, duration: 6.4, fall: 420 },
  { left: "80%", size: 9, delay: 0.9, duration: 5.1, fall: 330 },
  { left: "89%", size: 6, delay: 1.8, duration: 4.3, fall: 290 },
  { left: "12%", size: 5, delay: 3.6, duration: 5.4, fall: 320 },
  { left: "57%", size: 8, delay: 4.1, duration: 4.9, fall: 350 },
];

/**
 * Ceramic coating showcase: animated water droplets roll down a glossy
 * paint panel, beading and sliding off while the surface underneath stays
 * sharp. All motion is pure CSS (keyframes defined in tailwind.config.ts)
 * so it stays lightweight, and is skipped entirely under reduced motion.
 */
export function CeramicCoatingSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="ceramic-coating" className="relative py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <GlossPanel
          variant="red"
          glossStrength={0.9}
          videoSrc={detailingAssets.ceramicCoatingVideo}
          posterSrc={detailingAssets.ceramicCoatingPoster}
          imageAlt="Water droplets rolling off freshly coated glossy paint"
          className="relative order-2 aspect-[4/3] w-full lg:order-1"
        >
          {!reducedMotion && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {droplets.map((d, i) => (
                <span
                  key={i}
                  className="absolute top-0 animate-droplet rounded-[50%/60%]"
                  style={
                    {
                      left: d.left,
                      width: d.size,
                      height: d.size * 1.3,
                      animationDelay: `${d.delay}s`,
                      animationDuration: `${d.duration}s`,
                      "--fall": `${d.fall}px`,
                      background:
                        "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95), rgba(210,225,235,0.4) 45%, rgba(140,165,190,0.12) 100%)",
                      boxShadow:
                        "inset -1.5px -1.5px 3px rgba(0,0,0,0.3), inset 1.5px 1.5px 2.5px rgba(255,255,255,0.7)",
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          )}

          <div className="relative flex h-full items-end p-6">
            <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
              9H Ceramic Layer
            </span>
          </div>
        </GlossPanel>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Ceramic Coating"
            title="Built to protect the finish."
            description="Professional ceramic coating designed for long-term protection and a deep, glossy finish. Our coating carries a manufacturer-stated protection duration of up to 6 years with proper maintenance — actual longevity depends on care and driving conditions."
          />
          <div className="mt-8">
            <CTAButton href="#quote" variant="primary">
              Get A Quote
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
