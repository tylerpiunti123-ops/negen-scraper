export type IndustryId =
  | "home-services"
  | "construction"
  | "automotive"
  | "medical"
  | "dental"
  | "legal"
  | "real-estate"
  | "professional-services"
  | "other";

export interface IndustryOption {
  id: IndustryId;
  label: string;
}

export const industryOptions: IndustryOption[] = [
  { id: "home-services", label: "Home Services" },
  { id: "construction", label: "Construction" },
  { id: "automotive", label: "Automotive" },
  { id: "medical", label: "Medical" },
  { id: "dental", label: "Dental" },
  { id: "legal", label: "Legal" },
  { id: "real-estate", label: "Real Estate" },
  { id: "professional-services", label: "Professional Services" },
  { id: "other", label: "Other" },
];

export type BottleneckId =
  | "answering-calls"
  | "lead-followup"
  | "booking-appointments"
  | "sending-quotes"
  | "customer-support"
  | "getting-reviews"
  | "reactivating-customers"
  | "something-else";

export interface BottleneckOption {
  id: BottleneckId;
  label: string;
}

export const bottleneckOptions: BottleneckOption[] = [
  { id: "answering-calls", label: "Answering calls" },
  { id: "lead-followup", label: "Following up with leads" },
  { id: "booking-appointments", label: "Booking appointments" },
  { id: "sending-quotes", label: "Sending quotes" },
  { id: "customer-support", label: "Customer support" },
  { id: "getting-reviews", label: "Getting reviews" },
  { id: "reactivating-customers", label: "Reactivating old customers" },
  { id: "something-else", label: "Something else" },
];
