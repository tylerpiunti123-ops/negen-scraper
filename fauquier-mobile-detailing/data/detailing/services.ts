export interface DetailingService {
  id: string;
  title: string;
  description: string;
  variant: "black" | "red" | "chrome";
  imageSrc?: string;
}

export const detailingServices: DetailingService[] = [
  {
    id: "paint-correction",
    title: "Paint Correction",
    description:
      "Multi-stage machine polishing removes swirls, oxidation, and fine scratches to reveal true reflection depth.",
    variant: "black",
    imageSrc: "/detailing/source/blue-panel-taped-swirl-inspection-1-before.jpg",
  },
  {
    id: "ceramic-coating",
    title: "Ceramic Coating",
    description:
      "A durable, hydrophobic layer engineered for long-term gloss retention and protection against the elements.",
    variant: "red",
    imageSrc: "/detailing/source/mustang-mach1-roof-reflection.jpg",
  },
  {
    id: "headlight-restoration",
    title: "Headlight Restoration",
    description:
      "Cloudy, oxidized lenses are wet-sanded and polished back to optical clarity for safer night visibility.",
    variant: "chrome",
  },
  {
    id: "interior-detailing",
    title: "Interior Detailing",
    description:
      "Deep extraction, conditioning, and sanitizing that restores every surface inside the cabin.",
    variant: "black",
    imageSrc: "/detailing/source/camaro-interior.jpg",
  },
  {
    id: "exterior-detailing",
    title: "Exterior Detailing",
    description:
      "Hand wash, decontamination, and finishing passes that prep the paint for correction or coating.",
    variant: "chrome",
    imageSrc: "/detailing/source/corvette-z06-wheel-side.jpg",
  },
  {
    id: "mobile-detailing",
    title: "Mobile Detailing",
    description:
      "Full-service detailing brought to your driveway or office lot, without sacrificing shop-level results.",
    variant: "red",
    imageSrc: "/detailing/source/jeep-grand-cherokee-l-front-3q.jpg",
  },
];
