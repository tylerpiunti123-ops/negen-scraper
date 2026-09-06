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

export interface SampleConversation {
  id: string;
  customer: string;
  lastService: string;
  outbound: string;
  reply?: string;
  interested: boolean;
}

export const sampleConversations: SampleConversation[] = [
  {
    id: "c1",
    customer: "Denise Carter",
    lastService: "Driveway sealing — 14 months ago",
    outbound:
      "Hi Denise! It's been a while since your last driveway service — we're offering priority scheduling for past customers this month. Want us to take a look?",
    reply: "Actually yes, it's looking rough again. Can you send over some times?",
    interested: true,
  },
  {
    id: "c2",
    customer: "Marcus Webb",
    lastService: "Garage floor coating — 18 months ago",
    outbound:
      "Hey Marcus, checking in on the garage floor we coated last year — still holding up well? We're doing complimentary touch-up assessments this month.",
    reply: "It's fine for now, but thanks for checking in!",
    interested: false,
  },
  {
    id: "c3",
    customer: "Priya Nair",
    lastService: "Countertop install — 13 months ago",
    outbound:
      "Hi Priya! Hope the new countertops are treating you well. We're reaching out to past clients with a referral offer this month — interested?",
    reply: "We might actually need a matching backsplash done. Let's talk.",
    interested: true,
  },
];
