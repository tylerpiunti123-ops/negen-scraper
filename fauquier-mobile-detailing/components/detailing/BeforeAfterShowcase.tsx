"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { beforeAfterItems } from "@/data/detailing/beforeAfter";
import { BeforeAfterSlider } from "./shared/BeforeAfterSlider";
import { SectionHeading } from "./shared/DetailingSectionHeading";
import { cn } from "@/lib/utils";

export function BeforeAfterShowcase() {
  const firstItem = beforeAfterItems[0]!;
  const [activeId, setActiveId] = useState(firstItem.id);
  const active = beforeAfterItems.find((item) => item.id === activeId) ?? firstItem;

  return (
    <section id="before-after" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Before / After"
          title="Drag the line. See the difference."
          align="center"
          className="mx-auto"
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {beforeAfterItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
                item.id === activeId
                  ? "border-moto-red bg-moto-red/15 text-white"
                  : "border-moto-line text-mist-400 hover:border-moto-chromedim hover:text-paper-50",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <BeforeAfterSlider
                beforeAlt={`${active.label} before`}
                afterAlt={`${active.label} after`}
                aspectClassName="aspect-[4/3]"
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${active.id}-copy`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-moto-redlight">{active.label}</p>
              <h3 className="mt-3 text-2xl font-semibold text-paper-50">{active.headline}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist-400">{active.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
