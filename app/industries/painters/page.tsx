import type { Metadata } from "next";
import { nichePages } from "@/data/nichePages";
import { NichePageTemplate } from "@/components/servicePage/NichePageTemplate";

const content = nichePages.find((n) => n.slug === "painters")!;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/industries/painters" },
};

export default function Page() {
  return <NichePageTemplate content={content} />;
}
