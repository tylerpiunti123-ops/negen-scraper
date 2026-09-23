import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { detailingBusiness } from "@/data/detailing/business";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Temporary stand-in until the real domain is registered — this is the
// default *.vercel.app URL Vercel assigns to a project named
// "fauquier-mobile-detailing" (matching this folder/package name). If the
// name is taken and Vercel assigns a different one, update NEXT_PUBLIC_SITE_URL
// in that project's env vars instead of editing this fallback, and swap it
// again once a custom domain is attached.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fauquier-mobile-detailing.vercel.app";
const title = `${detailingBusiness.name} — Paint Correction, Ceramic Coating & Mobile Detailing`;
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
    siteName: detailingBusiness.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: detailingBusiness.logoMark,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: detailingBusiness.name,
  telephone: detailingBusiness.phoneDisplay,
  description,
  areaServed: "Fauquier County, VA",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-moto-black font-sans text-paper-50 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
