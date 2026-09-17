"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { paintGradients, paintFlecks, type PaintVariant } from "./paintGradients";

interface PlaceholderSurfaceProps {
  src?: string;
  videoSrc?: string;
  posterSrc?: string;
  alt?: string;
  variant?: PaintVariant;
  className?: string;
  desaturate?: boolean;
  flecks?: boolean;
}

/**
 * Renders real photography/video when provided; otherwise falls back to a
 * metallic gradient placeholder so layout/animation can be built ahead of
 * final vehicle imagery. `videoSrc` takes priority over `src` and is itself
 * skipped under prefers-reduced-motion in favor of `posterSrc` (or `src`).
 */
export function PlaceholderSurface({
  src,
  videoSrc,
  posterSrc,
  alt = "",
  variant = "black",
  className,
  desaturate = false,
  flecks = true,
}: PlaceholderSurfaceProps) {
  const reducedMotion = useReducedMotion();

  if (videoSrc && !reducedMotion) {
    return (
      <video
        className={cn("h-full w-full object-cover", desaturate && "saturate-[0.35] brightness-90", className)}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }

  const effectiveSrc = videoSrc ? posterSrc ?? src : src;

  if (effectiveSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={effectiveSrc}
        alt={alt}
        className={cn("h-full w-full object-cover", desaturate && "saturate-[0.35] brightness-90", className)}
      />
    );
  }

  return (
    <div
      className={cn("relative h-full w-full", className)}
      style={{
        backgroundImage: flecks ? `${paintFlecks}, ${paintGradients[variant]}` : paintGradients[variant],
      }}
      role="img"
      aria-label={alt}
    />
  );
}
