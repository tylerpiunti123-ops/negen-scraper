"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceholderSurface } from "./PlaceholderSurface";
import type { PaintVariant } from "./paintGradients";

interface BeforeAfterSliderProps {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeVariant?: PaintVariant;
  afterVariant?: PaintVariant;
  className?: string;
  aspectClassName?: string;
}

/**
 * Premium draggable before/after comparison. Works with mouse and touch via
 * the Pointer Events API, and supports arrow-key adjustment for keyboard
 * users. Reused across paint correction, headlight restoration, interior,
 * exterior, and rock-chip sections.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  beforeVariant = "black",
  afterVariant = "chrome",
  className,
  aspectClassName = "aspect-[4/3]",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, pct)));
  }, []);

  function onHandlePointerDown(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onHandlePointerUp(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function onContainerPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }

  function onContainerPointerDown(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    updateFromClientX(e.clientX);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") setPercent((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPercent((p) => Math.min(100, p + 4));
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-full touch-none select-none overflow-hidden rounded-2xl border border-moto-line bg-moto-panel shadow-gloss",
        aspectClassName,
        className,
      )}
      onPointerMove={onContainerPointerMove}
      onPointerDown={onContainerPointerDown}
      onPointerUp={() => (draggingRef.current = false)}
    >
      <div className="absolute inset-0">
        <PlaceholderSurface src={afterSrc} alt={afterAlt} variant={afterVariant} />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_18px_rgba(0,0,0,0.5)]" />
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <PlaceholderSurface src={beforeSrc} alt={beforeAlt} variant={beforeVariant} desaturate />
        <div className="pointer-events-none absolute inset-0 bg-black/10" />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/70 shadow-[0_0_16px_rgba(255,255,255,0.65)]"
        style={{ left: `${percent}%` }}
      />

      <div
        className="absolute inset-y-0 z-10 flex -translate-x-1/2 items-center"
        style={{ left: `${percent}%` }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label="Drag to compare before and after"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={onKeyDown}
          onPointerDown={onHandlePointerDown}
          onPointerUp={onHandlePointerUp}
          className="flex h-10 w-10 cursor-ew-resize items-center justify-center rounded-full border border-white/40 bg-white/90 text-moto-black shadow-[0_6px_20px_rgba(0,0,0,0.55)] transition-transform duration-150 hover:scale-110 active:scale-95"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
