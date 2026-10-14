export interface AiSeoScenario {
  id: string;
  industry: string;
  aiLabel: string;
  userQuestion: string;
  steps: string[];
  recommendation: {
    businessName: string;
    service: string;
    rating: number;
    reviewCount: number;
    availability: string;
  };
}

export const aiSeoScenarios: AiSeoScenario[] = [
  {
    id: "plumbing",
    industry: "Plumbing",
    aiLabel: "AI Assistant",
    userQuestion: "My pipe just burst in my kitchen and it's 2am, what do I do?",
    steps: [
      "Shut off your main water valve immediately — it's usually near your water meter or where the line enters the house.",
      "If water is near outlets, switches, or your electrical panel, shut off power to that area at the breaker.",
      "Move valuables away from the water and start containing it with towels or a wet vac if you have one.",
      "This isn't a wait-until-morning problem — call an emergency plumber now.",
    ],
    recommendation: {
      businessName: "Example Plumbing Co.",
      service: "24/7 Emergency Plumbing",
      rating: 4.9,
      reviewCount: 212,
      availability: "Open now — Emergency Service",
    },
  },
  {
    id: "electrical",
    industry: "Electrical",
    aiLabel: "AI Assistant",
    userQuestion: "An outlet in my bathroom just started sparking, what should I do?",
    steps: [
      "Don't touch the outlet or anything near it — step back immediately.",
      "Shut off power to that circuit at your breaker panel. If you're not sure which one, shut off the main breaker.",
      "Do not use water near the outlet, even if it looks like it's stopped sparking.",
      "A sparking outlet is a fire risk — call a licensed electrician right away, not in the morning.",
    ],
    recommendation: {
      businessName: "Example Electric",
      service: "Licensed Emergency Electrician",
      rating: 4.8,
      reviewCount: 156,
      availability: "Open now — Same-Day Service",
    },
  },
  {
    id: "hvac",
    industry: "HVAC",
    aiLabel: "AI Assistant",
    userQuestion: "My heat just went out and it's below freezing outside, what now?",
    steps: [
      "Check your breaker panel and thermostat batteries first — sometimes it's that simple.",
      "Keep interior doors open to let heat circulate evenly, and close off unused rooms.",
      "Let faucets drip slightly to reduce the risk of frozen pipes while you wait for help.",
      "In freezing temps, a dead furnace isn't a 'schedule it next week' problem — call an emergency HVAC tech.",
    ],
    recommendation: {
      businessName: "Example Heating & Air",
      service: "Emergency HVAC Repair",
      rating: 4.9,
      reviewCount: 189,
      availability: "Open now — 24/7 Dispatch",
    },
  },
];

export const aiSeoChecklist = [
  "Structured data (Schema.org) tells AI exactly what the business does and who it serves",
  "FAQ content answers the real questions people ask, in the format AI tools quote directly",
  "The site is crawlable and indexed — not blocked, not missing a sitemap",
  "Business info (name, service, availability) is consistent everywhere it appears online",
];
