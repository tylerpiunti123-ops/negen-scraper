"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit";
}

/**
 * Primary quote/action button with a subtle lift + light sweep on hover and
 * a small press-down on click. Motion is skipped under reduced-motion.
 */
export function CTAButton({ href, onClick, children, variant = "primary", className, type = "button" }: CTAButtonProps) {
  const reducedMotion = useReducedMotion();

  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-200",
    variant === "primary"
      ? "bg-moto-red text-white hover:bg-moto-redlight"
      : "border border-moto-chromedim/60 bg-transparent text-paper-50 hover:border-paper-50/60",
    className,
  );

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {!reducedMotion && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-12deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
    </>
  );

  const motionProps = reducedMotion
    ? {}
    : {
        whileHover: { y: -2, scale: 1.02 },
        whileTap: { y: 0, scale: 0.97 },
        transition: { type: "spring" as const, stiffness: 400, damping: 22 },
      };

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} className={classes} {...motionProps}>
      {content}
    </motion.button>
  );
}
