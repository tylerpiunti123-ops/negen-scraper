"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { detailingNavLinks } from "@/data/detailing/navigation";
import { CTAButton } from "./shared/CTAButton";
import { cn } from "@/lib/utils";

export function DetailingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
        scrolled
          ? "border-moto-line bg-moto-black/85 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-black/40 to-transparent",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-8",
          scrolled ? "h-16" : "h-20",
        )}
        aria-label="Primary"
      >
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight text-paper-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-moto-line bg-moto-panel font-mono text-xs text-moto-redlight">
            A
          </span>
          <span className="text-[15px]">Apex Auto Detailing</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {detailingNavLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-mist-400 transition-colors hover:text-paper-50"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex">
          <CTAButton href="#quote" variant="primary" className="px-5 py-2.5 text-xs">
            Get A Quote
          </CTAButton>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-paper-50 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-moto-line bg-moto-black md:hidden"
          >
            <ul className="flex flex-col gap-4 px-4 py-4">
              {detailingNavLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm text-mist-400 hover:text-paper-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="px-4 pb-4">
              <CTAButton href="#quote" variant="primary" onClick={() => setMenuOpen(false)} className="w-full">
                Get A Quote
              </CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
