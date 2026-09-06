import type { LucideIcon } from "lucide-react";
import { Headset, PhoneMissed, ListChecks, FileText, Users } from "lucide-react";

export type DemoId =
  | "receptionist"
  | "missed-call"
  | "lead-followup"
  | "quote-followup"
  | "reactivation";

export interface DemoMeta {
  id: DemoId;
  index: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
}

export const demos: DemoMeta[] = [
  {
    id: "receptionist",
    index: "01",
    title: "AI Receptionist",
    tagline: "Answers every inquiry, instantly",
    description:
      "A conversational agent that qualifies inbound leads, answers service questions, and books appointments — day or night.",
    icon: Headset,
  },
  {
    id: "missed-call",
    index: "02",
    title: "Missed Call Recovery",
    tagline: "Turns missed calls into booked jobs",
    description:
      "The moment a call is missed, the system texts the caller, continues the conversation, and captures the lead.",
    icon: PhoneMissed,
  },
  {
    id: "lead-followup",
    index: "03",
    title: "Lead Follow-Up",
    tagline: "Nobody goes cold in your pipeline",
    description:
      "A visual CRM that automatically follows up with every new lead on a fixed cadence until they respond.",
    icon: ListChecks,
  },
  {
    id: "quote-followup",
    index: "04",
    title: "Quote Follow-Up",
    tagline: "Stale quotes get chased automatically",
    description:
      "The system detects quotes sitting untouched and sends a personalized nudge before the opportunity dies.",
    icon: FileText,
  },
  {
    id: "reactivation",
    index: "05",
    title: "Customer Reactivation",
    tagline: "Turns your old customer list into revenue",
    description:
      "Segments past customers automatically and runs a personalized outreach campaign to bring them back.",
    icon: Users,
  },
];
