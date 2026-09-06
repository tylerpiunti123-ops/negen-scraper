export interface ProcessStep {
  index: string;
  title: string;
  summary: string;
  detail: string;
}

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Map",
    summary: "Find the bottlenecks.",
    detail:
      "We walk through how leads and customers actually move through your business today — calls, forms, texts, quotes — and identify exactly where time and opportunities are being lost.",
  },
  {
    index: "02",
    title: "Build",
    summary: "Create the automation.",
    detail:
      "We design and build the specific system that addresses your bottleneck — an AI receptionist, a follow-up sequence, a reactivation campaign — using the conversation logic your business actually needs.",
  },
  {
    index: "03",
    title: "Connect",
    summary: "Connect your existing tools.",
    detail:
      "The system connects to your CRM, phone number, calendar, and website — no need to rip out and replace what already works.",
  },
  {
    index: "04",
    title: "Optimize",
    summary: "Monitor and improve.",
    detail:
      "Once live, we track how the system performs and continue refining the conversation logic, timing, and messaging based on real results.",
  },
];
