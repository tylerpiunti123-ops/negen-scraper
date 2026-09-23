import { Phone } from "lucide-react";
import { detailingNavLinks } from "@/data/detailing/navigation";
import { detailingBusiness } from "@/data/detailing/business";
import { Container } from "@/components/ui/Container";
import { GlossPanel } from "./shared/GlossPanel";

export function DetailingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <GlossPanel variant="black" sweep={false} className="h-full w-full scale-y-[-1] rounded-none border-0" />
      </div>

      <Container className="relative flex flex-col gap-8 pb-14">
        <div className="flex flex-col justify-between gap-8 border-t border-moto-line pt-10 sm:flex-row">
          <div className="max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={detailingBusiness.logoMark} alt={detailingBusiness.name} className="h-16 w-auto" />
            <p className="mt-3 text-sm leading-relaxed text-mist-500">
              Paint correction, ceramic coating, and mobile detailing finished to a standard that
              holds up in direct sunlight.
            </p>
            <a
              href={detailingBusiness.phoneHref}
              className="mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-paper-50 transition-colors hover:text-moto-bluelight"
            >
              <Phone className="h-4 w-4 text-moto-redlight" />
              {detailingBusiness.phoneDisplay}
            </a>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-mist-500">Explore</p>
              <ul className="mt-3 space-y-2">
                {detailingNavLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-mist-400 hover:text-paper-50">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-mist-500">Get Started</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#quote" className="text-sm text-mist-400 hover:text-paper-50">
                    Get A Quote
                  </a>
                </li>
                <li>
                  <a href="#before-after" className="text-sm text-mist-400 hover:text-paper-50">
                    See Results
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-moto-line pt-6 text-xs text-mist-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {detailingBusiness.name}. All rights reserved.</p>
          <p>Vehicle imagery shown throughout this site is illustrative.</p>
        </div>
      </Container>
    </footer>
  );
}
