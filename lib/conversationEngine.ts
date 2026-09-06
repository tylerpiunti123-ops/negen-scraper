export type ReceptionistField =
  | "intent"
  | "service"
  | "scope"
  | "budget"
  | "timeline"
  | "contact"
  | "slot";

export interface ReceptionistAnswers {
  intent?: string;
  service?: string;
  scope?: string;
  budget?: string;
  timeline?: string;
  contact?: string;
  slot?: string;
}

export interface ConversationStep {
  id: ReceptionistField;
  getMessage: (answers: ReceptionistAnswers) => string;
  options?: string[];
  inputType: "choice" | "text";
  placeholder?: string;
}

export const receptionistSteps: ConversationStep[] = [
  {
    id: "intent",
    inputType: "choice",
    getMessage: () =>
      "Hey! Thanks for reaching out. What can I help you with today?",
    options: ["I'd like an estimate", "I have a question about a service", "Checking on my project"],
  },
  {
    id: "service",
    inputType: "choice",
    getMessage: () => "Absolutely, I can help with that. What type of project are you looking to get an estimate for?",
    options: ["Flooring", "Garage floor coating", "Countertops", "Something else"],
  },
  {
    id: "scope",
    inputType: "choice",
    getMessage: (a) =>
      `Got it${a.service ? ` — ${a.service.toLowerCase()}` : ""}. Roughly how large is the space we're working with?`,
    options: ["Under 500 sq ft", "500–1,500 sq ft", "1,500+ sq ft"],
  },
  {
    id: "budget",
    inputType: "choice",
    getMessage: () => "Thanks, that helps. Do you have a rough budget range in mind for this project?",
    options: ["Under $2,000", "$2,000–$5,000", "$5,000+", "Not sure yet"],
  },
  {
    id: "timeline",
    inputType: "choice",
    getMessage: () => "Good to know. And when are you hoping to get this done?",
    options: ["As soon as possible", "Within the next month", "Just researching for now"],
  },
  {
    id: "contact",
    inputType: "text",
    getMessage: () => "Got it. I can help get that started. What's the best name and phone number for you?",
    placeholder: "e.g. Sarah Miller, (614) 555-0142",
  },
  {
    id: "slot",
    inputType: "choice",
    getMessage: (a) => {
      const name = extractName(a.contact);
      return `Thanks${name ? `, ${name}` : ""}. I have a few openings for a free on-site estimate — which works best?`;
    },
    options: ["Tomorrow, 10:00 AM", "Tomorrow, 2:00 PM", "Friday, 9:00 AM"],
  },
];

export function extractName(contact?: string): string {
  if (!contact) return "";
  const withoutPhone = contact.replace(/[+()\-.\s]?\d[\d()\-.\s]{6,}\d/g, "").trim();
  const cleaned = withoutPhone.replace(/^(i'?m|this is|it's)\s+/i, "").replace(/[,.-]+$/, "").trim();
  const firstToken = cleaned.split(/\s+/).slice(0, 2).join(" ");
  return firstToken || "";
}

export function extractPhone(contact?: string): string {
  if (!contact) return "";
  const match = contact.match(/[\d()\-.\s+]{7,}/);
  return match ? match[0].trim() : "";
}

export function getStep(index: number): ConversationStep | undefined {
  return receptionistSteps[index];
}

export const TOTAL_RECEPTIONIST_STEPS = receptionistSteps.length;
