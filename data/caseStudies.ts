export interface CaseStudy {
  industry: string;
  problem: string;
  system: string[];
  result: string;
}

export const caseStudies: CaseStudy[] = [
  {
    industry: "Home Services",
    problem: "Leads were coming in after business hours and going unanswered until the next morning.",
    system: ["AI Receptionist", "Missed Call Recovery", "Automated Follow-Up"],
    result: "Every inquiry receives an immediate response, regardless of when it comes in.",
  },
  {
    industry: "Dental Practice",
    problem: "Front desk staff spent hours a day on scheduling calls and no-show follow-up.",
    system: ["AI Receptionist", "Appointment Booking", "Automated Reminders"],
    result: "Scheduling and reminders run automatically, freeing front desk time for patients in-office.",
  },
  {
    industry: "Construction",
    problem: "Quotes were sent and then forgotten, with no consistent process to follow up.",
    system: ["Quote Follow-Up", "CRM Pipeline", "Sales Rep Handoff"],
    result: "Stale quotes are automatically flagged and followed up before the opportunity goes cold.",
  },
];

export const caseStudiesNote =
  "These are illustrative case study structures. Figures will be replaced with real client results as case studies are published.";
