import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

const siteUrl = "https://nextgenclosersai.vercel.app";
const title = "NextGen Closers AI — Remote AI Automation for Service Businesses";
const description =
  "NextGen Closers AI builds AI-powered systems for service-based businesses — capturing leads, responding to customers, and automating follow-up. Fully remote, working with clients anywhere. Try the live demos before you talk to us.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — NextGen Closers AI",
  },
  description,
  keywords: [
    "AI automation",
    "AI automation for service businesses",
    "remote AI automation company",
    "business automation systems",
    "AI receptionist",
    "missed call recovery",
    "lead follow-up automation",
    "CRM automation",
  ],
  authors: [{ name: "NextGen Closers AI" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "NextGen Closers AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NextGen Closers AI — AI systems that run your front office",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NextGen Closers AI",
  alternateName: "NextGen Closers",
  url: siteUrl,
  description,
  knowsAbout: [
    "AI automation",
    "AI automation for service businesses",
    "AI receptionist",
    "missed call recovery",
    "lead qualification automation",
    "CRM automation",
    "customer follow-up automation",
    "customer reactivation campaigns",
  ],
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Service-based businesses",
  },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "AI Business Automation Systems",
      serviceType: "AI automation consulting and implementation",
      description:
        "Custom AI systems for lead qualification, missed call recovery, follow-up automation, and customer reactivation, delivered fully remotely for service-based businesses of any kind.",
      audience: {
        "@type": "Audience",
        audienceType: "Service-based businesses",
      },
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-ink-950 font-sans text-paper-50 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
