import { detailingServices } from "@/data/detailing/services";
import { GlossPanel } from "./shared/GlossPanel";
import { Tilt3D } from "./shared/Tilt3D";
import { SectionHeading } from "./shared/DetailingSectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

/**
 * Service grid with restrained 3D perspective on hover: a gentle tilt toward
 * the cursor, deeper shadow, and the title popping slightly forward via
 * translateZ inside the tilted 3D context. No spinning, no gimmicks.
 */
export function ServiceCards3D() {
  return (
    <section id="services" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Every finish, done right."
          description="Six services, one standard: correction and protection that hold up in direct sunlight."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {detailingServices.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.05}>
              <Tilt3D className="group h-full" maxTilt={6} liftScale={1.02}>
                <GlossPanel
                  variant={service.variant}
                  glossStrength={0.6}
                  sweep={false}
                  imageSrc={service.imageSrc}
                  imageAlt={service.title}
                  className="h-full min-h-[260px] transition-shadow duration-300 group-hover:shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85)]"
                >
                  {service.imageSrc && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-lg font-semibold text-paper-50 transition-transform duration-300 group-hover:[transform:translateZ(28px)]">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist-400">{service.description}</p>
                  </div>
                </GlossPanel>
              </Tilt3D>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
