import { Navbar } from "@/components/nav/Navbar";
import { Hero } from "@/components/hero/Hero";
import { DemoGrid } from "@/components/demos/DemoGrid";
import { AutomationLab } from "@/components/lab/AutomationLab";
import { IndustryExplorer } from "@/components/industries/IndustryExplorer";
import { ROICalculator } from "@/components/roi/ROICalculator";
import { AutomationBuilder } from "@/components/builder/AutomationBuilder";
import { LiveOpsDashboard } from "@/components/dashboard/LiveOpsDashboard";
import { HowItWorks } from "@/components/process/HowItWorks";
import { CaseStudies } from "@/components/results/CaseStudies";
import { FinalCTA } from "@/components/cta/FinalCTA";
import { BookingSection } from "@/components/contact/BookingSection";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DemoGrid />
        <AutomationLab />
        <IndustryExplorer />
        <ROICalculator />
        <AutomationBuilder />
        <LiveOpsDashboard />
        <HowItWorks />
        <CaseStudies />
        <FinalCTA />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
