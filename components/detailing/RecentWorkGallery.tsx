import { galleryPhotos } from "@/data/detailing/assets";
import { GlossPanel } from "./shared/GlossPanel";
import { Tilt3D } from "./shared/Tilt3D";
import { SectionHeading } from "./shared/DetailingSectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

/**
 * Recent finished work, shown with the same restrained 3D hover as the
 * service cards. Pure proof-of-quality — no interactive gimmicks needed.
 */
export function RecentWorkGallery() {
  return (
    <section id="gallery" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Recent Work"
          title="Straight from the shop floor."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {galleryPhotos.map((photo, i) => (
            <FadeIn key={photo.src} delay={(i % 4) * 0.05}>
              <Tilt3D maxTilt={5} liftScale={1.03}>
                <GlossPanel
                  variant="black"
                  glossStrength={0.45}
                  sweep={false}
                  imageSrc={photo.src}
                  imageAlt={photo.alt}
                  className="aspect-[4/3] w-full"
                />
              </Tilt3D>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
