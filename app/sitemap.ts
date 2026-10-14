import type { MetadataRoute } from "next";
import { servicePages } from "@/data/servicePages";
import { nichePages } from "@/data/nichePages";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://nextgenclosersai.vercel.app";
  const now = new Date();

  const servicePageEntries: MetadataRoute.Sitemap = servicePages.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const nichePageEntries: MetadataRoute.Sitemap = nichePages.map((page) => ({
    url: `${siteUrl}/industries/${page.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...servicePageEntries,
    ...nichePageEntries,
  ];
}
