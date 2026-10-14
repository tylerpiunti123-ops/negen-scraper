import type { LucideIcon } from "lucide-react";
import { Instagram, MapPin, Search } from "lucide-react";

export const adCampaignGoal = "Generate leads for garage floor coating";

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

export const adVariations: AdVariation[] = [
  {
    platform: "Google Search",
    icon: Search,
    headline: "Garage Floor Coating — Free Estimate",
    body: "Durable epoxy coatings installed in a day. Licensed & insured. Book a free on-site estimate.",
  },
  {
    platform: "Google Local Services",
    icon: MapPin,
    headline: "Top-Rated Garage Floor Pros Near You",
    body: "Verified & background-checked. See real reviews from homeowners in your area.",
  },
  {
    platform: "Facebook / Instagram",
    icon: Instagram,
    headline: "Transform Your Garage This Weekend",
    body: "See why homeowners are switching to epoxy floors. Get a free quote in 60 seconds.",
  },
];

export const adTargeting = [
  "15-mile service radius",
  "Homeowners, ages 30–65",
  "Keywords: garage floor coating, epoxy flooring near me",
  "Recently searched home improvement",
];

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
