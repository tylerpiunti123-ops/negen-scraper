"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CTAButton } from "./shared/CTAButton";

/**
 * Sticky bottom "Get A Quote" bar for small screens. Appears once the visitor
 * starts scrolling, with a subtle entrance animation, and stays out of the
 * way of the desktop nav CTA.
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 88, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 88, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-moto-line bg-moto-black/95 px-4 py-3 backdrop-blur-md md:hidden"
        >
          <CTAButton href="#quote" variant="primary" className="w-full">
            Get A Quote
          </CTAButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
