import type { Metadata } from "next";
import { servicePages } from "@/data/servicePages";
import { ServicePageTemplate } from "@/components/servicePage/ServicePageTemplate";

const content = servicePages.find((s) => s.slug === "ai-receptionist")!;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/ai-receptionist" },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
