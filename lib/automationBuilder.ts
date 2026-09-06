import type { BottleneckId, IndustryId } from "@/data/builderOptions";
import { bottleneckOptions, industryOptions } from "@/data/builderOptions";

const industryMaps: Record<IndustryId, string[]> = {
  "home-services": ["Missed Call", "AI Receptionist", "Lead Qualification", "CRM", "Appointment", "Follow-Up"],
  construction: ["New Inquiry", "AI Qualification", "Site Assessment", "Quote", "CRM", "Follow-Up"],
  automotive: ["New Inquiry", "AI Qualification", "Vehicle Info", "CRM", "Appointment", "Follow-Up"],
  medical: ["New Inquiry", "AI Receptionist", "Intake", "CRM", "Appointment", "Reminder"],
  dental: ["New Inquiry", "AI Receptionist", "Qualification", "CRM", "Appointment", "Reminder"],
  legal: ["New Inquiry", "AI Intake", "Case Qualification", "CRM", "Consultation", "Follow-Up"],
  "real-estate": ["New Inquiry", "AI Qualification", "Property Match", "CRM", "Showing", "Follow-Up"],
  "professional-services": ["New Inquiry", "AI Qualification", "Discovery Call", "CRM", "Proposal", "Follow-Up"],
  other: ["New Inquiry", "AI Qualification", "CRM", "Follow-Up", "Appointment"],
};

const bottleneckExplanations: Record<BottleneckId, string> = {
  "answering-calls":
    "This system is designed to answer every inbound call or message immediately — day or night — so no opportunity goes unanswered while it's qualified for your team.",
  "lead-followup":
    "This system is designed to respond to new opportunities immediately, qualify the customer, and keep following up automatically until they book or opt out.",
  "booking-appointments":
    "This system is designed to move a qualified lead straight to your calendar, removing the back-and-forth that usually costs you the booking.",
  "sending-quotes":
    "This system is designed to track every quote sent and automatically follow up before it goes cold, without anyone having to remember to do it.",
  "customer-support":
    "This system is designed to give customers an immediate, accurate response to common questions while flagging anything that needs a human.",
  "getting-reviews":
    "This system is designed to request a review automatically once a job is marked complete, while the experience is still fresh.",
  "reactivating-customers":
    "This system is designed to identify past customers who haven't booked recently and re-engage them with a personalized, automated outreach sequence.",
  "something-else":
    "This system is designed to route new opportunities to the right process automatically, so your team spends time closing instead of chasing.",
};

const bottleneckAppendNode: Partial<Record<BottleneckId, string>> = {
  "getting-reviews": "Review Request",
  "reactivating-customers": "Reactivation Campaign",
};

export interface AutomationMapResult {
  industryLabel: string;
  bottleneckLabel: string;
  steps: string[];
  explanation: string;
}

export function buildAutomationMap(
  industry: IndustryId,
  bottleneck: BottleneckId,
): AutomationMapResult {
  const industryLabel = industryOptions.find((i) => i.id === industry)?.label ?? "Your Business";
  const bottleneckLabel = bottleneckOptions.find((b) => b.id === bottleneck)?.label ?? "";
  const baseSteps = industryMaps[industry] ?? industryMaps.other;
  const appendNode = bottleneckAppendNode[bottleneck];
  const steps =
    appendNode && !baseSteps.includes(appendNode) ? [...baseSteps, appendNode] : baseSteps;

  return {
    industryLabel,
    bottleneckLabel,
    steps,
    explanation: bottleneckExplanations[bottleneck],
  };
}
