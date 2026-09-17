import type { Metadata } from "next";

const siteUrl = "https://nextgenclosersai.vercel.app/detailing";
const title = "Apex Auto Detailing — Paint Correction, Ceramic Coating & Mobile Detailing";
const description =
  "Premium mobile and in-shop auto detailing: paint correction, ceramic coating engineered for long-term protection, headlight restoration, and full interior/exterior detailing.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "Apex Auto Detailing",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function DetailingLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-moto-black text-paper-50 antialiased">{children}</div>;
}
