import { DetailingNavbar } from "@/components/detailing/DetailingNavbar";
import { Hero3D } from "@/components/detailing/Hero3D";
import { ServiceCards3D } from "@/components/detailing/ServiceCards3D";
import { TransformationScroll } from "@/components/detailing/TransformationScroll";
import { PaintCorrectionSection } from "@/components/detailing/PaintCorrectionSection";
import { CeramicCoatingSection } from "@/components/detailing/CeramicCoatingSection";
import { BeforeAfterShowcase } from "@/components/detailing/BeforeAfterShowcase";
import { HeadlightRestoration } from "@/components/detailing/HeadlightRestoration";
import { WetSandingSection } from "@/components/detailing/WetSandingSection";
import { MobileDetailingScene } from "@/components/detailing/MobileDetailingScene";
import { QuoteFlow } from "@/components/detailing/QuoteFlow";
import { StickyMobileCTA } from "@/components/detailing/StickyMobileCTA";
import { DetailingFooter } from "@/components/detailing/DetailingFooter";

export default function DetailingPage() {
  return (
    <>
      <DetailingNavbar />
      <main>
        <Hero3D />
        <ServiceCards3D />
        <TransformationScroll />
        <PaintCorrectionSection />
        <CeramicCoatingSection />
        <BeforeAfterShowcase />
        <HeadlightRestoration />
        <WetSandingSection />
        <MobileDetailingScene />
        <QuoteFlow />
      </main>
      <DetailingFooter />
      <StickyMobileCTA />
    </>
  );
}
