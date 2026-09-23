export interface BeforeAfterItem {
  id: string;
  label: string;
  headline: string;
  description: string;
  /** Swap these with real photography — see components/detailing/shared/GlossPanel.tsx */
  beforeImageSrc?: string;
  afterImageSrc?: string;
}

export const beforeAfterItems: BeforeAfterItem[] = [
  {
    id: "paint-correction",
    label: "Paint Correction",
    headline: "Swirls gone. Depth restored.",
    description: "Multi-stage compounding and polishing lifts years of fine scratching out of the clear coat.",
  },
  {
    id: "headlight-restoration",
    label: "Headlight Restoration",
    headline: "Cloudy to crystal clear.",
    description: "Oxidized lenses are wet-sanded through progressive grits and sealed for UV resistance.",
  },
  {
    id: "interior-detailing",
    label: "Interior Detailing",
    headline: "Every surface, refreshed.",
    description: "Steam extraction and conditioning bring worn interiors back to a like-new state.",
  },
  {
    id: "exterior-detailing",
    label: "Exterior Detailing",
    headline: "Decontaminated and refined.",
    description: "A full wash and clay treatment strips embedded contaminants before any correction begins.",
  },
  {
    id: "rock-chip-touch-up",
    label: "Rock Chip Touch-Up",
    headline: "Seamless, precise repair.",
    description: "Matched touch-up and leveling blend chips back into the surrounding panel.",
  },
];
