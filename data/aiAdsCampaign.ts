import type { LucideIcon } from "lucide-react";
import { Instagram, MapPin, Search } from "lucide-react";
import { DEFAULT_NICHE } from "@/lib/conversationEngine";

export function buildAdCampaignGoal(niche: string = DEFAULT_NICHE): string {
  return `Generate leads for ${(niche.trim() || DEFAULT_NICHE).toLowerCase()}`;
}

export const adPhases = [
  "Analyzing business & service area",
  "Generating ad creative",
  "Setting targeting",
  "Launching campaign",
];

export interface AdVariation {
  platform: string;
  icon: LucideIcon;
  headline: string;
  body: string;
}

export function buildAdVariations(niche: string = DEFAULT_NICHE): AdVariation[] {
  const service = niche.trim() || DEFAULT_NICHE;
  const serviceLower = service.toLowerCase();

  return [
    {
      platform: "Google Search",
      icon: Search,
      headline: `${service} — Free Estimate`,
      body: `Quality ${serviceLower} you can trust. Licensed & insured. Book a free on-site estimate.`,
    },
    {
      platform: "Google Local Services",
      icon: MapPin,
      headline: `Top-Rated ${service} Pros Near You`,
      body: "Verified & background-checked. See real reviews from customers in your area.",
    },
    {
      platform: "Facebook / Instagram",
      icon: Instagram,
      headline: `Get ${service} Done This Week`,
      body: `See why customers are choosing us for ${serviceLower}. Get a free quote in 60 seconds.`,
    },
  ];
}

export function buildAdTargeting(niche: string = DEFAULT_NICHE): string[] {
  const serviceLower = (niche.trim() || DEFAULT_NICHE).toLowerCase();

  return [
    "15-mile service radius",
    "Homeowners, ages 30–65",
    `Keywords: ${serviceLower}, ${serviceLower} near me`,
    "Recently searched home improvement",
  ];
}

export interface AdMetric {
  label: string;
  value: number;
  isCurrency?: boolean;
}

export const adMetrics: AdMetric[] = [
  { label: "Impressions", value: 8400 },
  { label: "Clicks", value: 312 },
  { label: "Leads", value: 19 },
  { label: "Cost Per Lead", value: 14, isCurrency: true },
];

export interface BudgetSplit {
  platform: string;
  before: number;
  after: number;
}

export const budgetReallocation: BudgetSplit[] = [
  { platform: "Google Search", before: 34, after: 52 },
  { platform: "Google Local Services", before: 33, after: 38 },
  { platform: "Facebook / Instagram", before: 33, after: 10 },
];
