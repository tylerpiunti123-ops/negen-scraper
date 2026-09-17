import { cn } from "@/lib/utils";
import { paintGradients, paintFlecks, type PaintVariant } from "./paintGradients";

interface PlaceholderSurfaceProps {
  src?: string;
  alt?: string;
  variant?: PaintVariant;
  className?: string;
  desaturate?: boolean;
  flecks?: boolean;
}

/**
 * Renders real photography when `src` is provided; otherwise falls back to a
 * metallic gradient placeholder so layout/animation can be built ahead of
 * final vehicle imagery. Swap `src` in the data files under data/detailing/
 * once real photos or video stills are available.
 */
export function PlaceholderSurface({
  src,
  alt = "",
  variant = "black",
  className,
  desaturate = false,
  flecks = true,
}: PlaceholderSurfaceProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
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
