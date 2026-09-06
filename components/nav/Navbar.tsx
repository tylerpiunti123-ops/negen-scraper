"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
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
        "fixed inset-x-0 top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? "border-ink-700 bg-ink-950/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-14" : "h-20",
        )}
        aria-label="Primary"
      >
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight text-paper-50">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-600 bg-ink-900 font-mono text-xs text-accent">
            N
          </span>
          <span className="text-[15px]">NextGen Closers AI</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
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

        <div className="hidden items-center gap-3 md:flex">
          <Button href="#demos" variant="secondary" size="sm">
            Try AI Demo
          </Button>
          <Button href="#contact" variant="primary" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
            Book A Call
          </Button>
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

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-ink-700 bg-ink-950 px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
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
          <div className="mt-4 flex flex-col gap-2">
            <Button href="#demos" variant="secondary" size="sm" onClick={() => setMenuOpen(false)}>
              Try AI Demo
            </Button>
            <Button href="#contact" variant="primary" size="sm" onClick={() => setMenuOpen(false)}>
              Book A Call
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
