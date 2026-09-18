"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  maxTilt?: number;
  liftScale?: number;
  perspective?: number;
}

/**
 * Restrained 3D perspective tilt for cards/panels — follows the cursor with a
 * spring and gently lifts on hover. Falls back to a static wrapper when
 * prefers-reduced-motion is set.
 */
export function Tilt3D({
  children,
  className,
  innerClassName,
  maxTilt = 7,
  liftScale = 1.015,
  perspective = 1200,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 160, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 160, damping: 20, mass: 0.4 });

  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective }}
      className={className}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: liftScale, y: -4 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className={cn("h-full w-full", innerClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}
