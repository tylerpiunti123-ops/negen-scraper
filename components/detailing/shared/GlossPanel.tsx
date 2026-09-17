"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlaceholderSurface } from "./PlaceholderSurface";
import type { PaintVariant } from "./paintGradients";

interface GlossPanelProps {
  variant?: PaintVariant;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  children?: ReactNode;
  sweep?: boolean;
  glossStrength?: number;
  desaturate?: boolean;
}

type PanelStyle = CSSProperties & { "--mx"?: string; "--my"?: string };

/**
 * A glossy paint panel whose specular highlight tracks the pointer. Used as
 * the base surface for the hero vehicle, paint correction, and ceramic
 * coating sections. Pass `imageSrc` to layer real photography underneath the
 * gloss/reflection effect once available.
 */
export function GlossPanel({
  variant = "black",
  imageSrc,
  imageAlt = "",
  className,
  children,
  sweep = true,
  glossStrength = 0.5,
  desaturate = false,
}: GlossPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }

  function handlePointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "20%");
  }

  const style: PanelStyle = { "--mx": "50%", "--my": "20%" };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-moto-line shadow-gloss",
        className,
      )}
      style={style}
    >
      <PlaceholderSurface
        src={imageSrc}
        alt={imageAlt}
        variant={variant}
        desaturate={desaturate}
        className="absolute inset-0"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(380px circle at var(--mx) var(--my), rgba(255,255,255,${(
            0.4 * glossStrength
          ).toFixed(2)}), transparent 62%)`,
          mixBlendMode: "screen",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 32%)" }}
      />

      {sweep && !reducedMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_24px_rgba(0,0,0,0.55)]" />

      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
