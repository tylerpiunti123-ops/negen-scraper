export interface CampaignStage {
  id: string;
  label: string;
}

export const campaignStages: CampaignStage[] = [
  { id: "identify", label: "AI identifies eligible customers" },
  { id: "segment", label: "AI segments by service history" },
  { id: "generate", label: "Personalized messages generated" },
  { id: "send", label: "Messages sent" },
  { id: "capture", label: "Responses captured" },
  { id: "route", label: "Interested customers routed to sales" },
];

import { DEFAULT_NICHE } from "@/lib/conversationEngine";

export interface SampleConversation {
  id: string;
  customer: string;
  lastService: string;
  outbound: string;
  reply?: string;
  interested: boolean;
}

export function buildSampleConversations(niche: string = DEFAULT_NICHE): SampleConversation[] {
  const service = (niche.trim() || DEFAULT_NICHE).toLowerCase();

  return [
    {
      id: "c1",
      customer: "Denise Carter",
      lastService: `${niche} — 14 months ago`,
      outbound: `Hi Denise! It's been a while since your last ${service} service — we're offering priority scheduling for past customers this month. Want us to take a look?`,
      reply: "Actually yes, we could use that again. Can you send over some times?",
      interested: true,
    },
    {
      id: "c2",
      customer: "Marcus Webb",
      lastService: `${niche} — 18 months ago`,
      outbound: `Hey Marcus, checking in since your last ${service} service — still happy with how everything turned out? We're doing complimentary touch-up assessments this month.`,
      reply: "It's fine for now, but thanks for checking in!",
      interested: false,
    },
    {
      id: "c3",
      customer: "Priya Nair",
      lastService: `${niche} — 13 months ago`,
      outbound: `Hi Priya! Hope everything's still holding up well. We're reaching out to past clients with a referral offer this month — interested?`,
      reply: "We might actually need something similar done again. Let's talk.",
      interested: true,
    },
  ];
}
