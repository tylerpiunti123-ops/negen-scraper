import { Search, PhoneCall, Megaphone, Sparkles } from "lucide-react";
import {
  servicesOverviewHeadline,
  servicesOverviewIntro,
  servicesOverviewItems,
  type ServiceOverviewItem,
} from "@/data/servicesOverview";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

const icons: Record<ServiceOverviewItem["icon"], typeof Search> = {
  search: Search,
  phone: PhoneCall,
  megaphone: Megaphone,
  sparkles: Sparkles,
};

export function ServicesOverview() {
  return (
    <section id="services" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title={servicesOverviewHeadline}
          description={servicesOverviewIntro}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {servicesOverviewItems.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <FadeIn key={item.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-xl border border-ink-700 bg-ink-900/60 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-950 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-lg font-semibold text-paper-50">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400">{item.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
