export type PaintVariant = "black" | "red" | "chrome";

/**
 * Stand-in "glossy paint" surfaces used until real vehicle photography/video
 * is dropped in. Every consumer accepts an optional `src` prop that renders
 * an <img> in place of the gradient without changing any animation logic.
 */
export const paintGradients: Record<PaintVariant, string> = {
  black:
    "radial-gradient(120% 120% at 50% 0%, #1e1f24 0%, #0c0d10 45%, #040405 100%)",
  red: "radial-gradient(120% 120% at 50% 0%, #82182a 0%, #3c0c16 45%, #0a0508 100%)",
  chrome:
    "radial-gradient(120% 120% at 50% 0%, #464850 0%, #202126 45%, #0a0b0d 100%)",
};

export const paintFlecks =
  "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)";
