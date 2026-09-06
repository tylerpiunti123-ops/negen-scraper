import type { IndustryId } from "@/data/builderOptions";

export const industryPipelines: Record<IndustryId, string[]> = {
  "home-services": ["Lead", "AI Receptionist", "Qualification", "Booking"],
  construction: ["Lead", "AI Qualification", "Site Assessment", "Quote"],
  automotive: ["Lead", "AI Qualification", "Vehicle / Service Info", "Appointment", "Follow-Up"],
  medical: ["Lead", "AI Receptionist", "Intake", "Appointment", "Reminder"],
  dental: ["Lead", "AI Receptionist", "Qualification", "Appointment", "Reminder"],
  legal: ["Lead", "AI Intake", "Case Qualification", "Consultation"],
  "real-estate": ["Lead", "AI Qualification", "Property Match", "Showing", "Follow-Up"],
  "professional-services": ["Lead", "AI Qualification", "Discovery Call", "Proposal"],
  other: ["Lead", "AI Qualification", "CRM", "Follow-Up"],
};
