/**
 * Real vehicle photography/video captured for the shop, served straight out
 * of public/detailing/. Swap or add paths here as better shots come in —
 * every consumer (GlossPanel, service cards, gallery) just takes a path.
 */
export const detailingAssets = {
  hero: "/detailing/source/ram-1500-front.jpg",

  paintCorrectionVideo: "/detailing/video/paint-correction-gloss.mp4",
  paintCorrectionPoster: "/detailing/posters/video-1-poster.jpg",

  ceramicCoatingVideo: "/detailing/video/ceramic-water-droplets.mp4",
  ceramicCoatingPoster: "/detailing/posters/video-2-poster.jpg",

  transformationBefore: "/detailing/source/red-tractor-hood-oxidized-before.jpg",

  wetSanding: "/detailing/source/kenworth-semi-truck-front.jpg",
  mobileDetailing: "/detailing/source/mustang-gt-2024-wash-side.jpg",
} as const;

export const galleryPhotos = [
  { src: "/detailing/source/corvette-z06-front-3q.jpg", alt: "Corvette Z06 convertible, front three-quarter" },
  { src: "/detailing/source/mustang-shelby-gt500-front.jpg", alt: "Shelby GT500 front end" },
  { src: "/detailing/source/mach1-mustang-side-closeup.jpg", alt: "Mach 1 Mustang side panel close-up" },
  { src: "/detailing/source/classic-chevy-panel-truck-green.jpg", alt: "Restored classic Chevrolet panel truck" },
  { src: "/detailing/source/jeep-grand-cherokee-l-front-3q.jpg", alt: "Jeep Grand Cherokee L, front three-quarter" },
  { src: "/detailing/source/silverado-interior-1.jpg", alt: "Chevrolet Silverado interior detail" },
  { src: "/detailing/source/bmw-interior-dash.jpg", alt: "BMW interior dash detail" },
  { src: "/detailing/source/travel-trailer-side.jpg", alt: "Travel trailer exterior panel" },
] as const;
