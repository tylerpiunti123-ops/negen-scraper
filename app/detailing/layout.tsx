import type { Metadata } from "next";

const siteUrl = "https://nextgenclosersai.vercel.app/detailing";
const title = "Fauquier Mobile Detailing — Paint Correction, Ceramic Coating & Mobile Detailing";
const description =
  "Fauquier Mobile Detailing brings premium paint correction, ceramic coating engineered for long-term protection, headlight restoration, and full interior/exterior detailing straight to your driveway. Call 540-878-8636.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "Fauquier Mobile Detailing",
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
