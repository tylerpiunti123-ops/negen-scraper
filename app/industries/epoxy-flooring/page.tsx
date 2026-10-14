import type { Metadata } from "next";
import { nichePages } from "@/data/nichePages";
import { NichePageTemplate } from "@/components/servicePage/NichePageTemplate";

const content = nichePages.find((n) => n.slug === "epoxy-flooring")!;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/industries/epoxy-flooring" },
};

export default function Page() {
  return <NichePageTemplate content={content} />;
}
