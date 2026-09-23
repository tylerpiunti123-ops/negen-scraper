export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What is an AI automation company?",
    answer:
      "An AI automation company designs and builds AI-powered systems that handle repetitive front-office work for a business — answering calls and messages, qualifying leads, following up automatically, booking appointments, and keeping a CRM updated — instead of selling generic chatbot software you have to configure yourself.",
  },
  {
    question: "What does an AI receptionist actually do?",
    answer:
      "An AI receptionist answers inbound calls, texts, or web chats in real time, asks the same qualifying questions a trained employee would, and either books an appointment directly or hands off a qualified lead to your team — running 24/7 instead of only during business hours.",
  },
  {
    question: "How much does AI automation cost for a small business?",
    answer:
      "Cost depends on which systems you need and how many channels they cover (calls, SMS, email, CRM). Most small business implementations are scoped around a single bottleneck first — like missed calls or slow follow-up — rather than a full platform, which keeps the initial cost proportional to the problem.",
  },
  {
    question: "How long does it take to set up an AI automation system?",
    answer:
      "A single-purpose system (for example, missed call recovery or automated quote follow-up) typically takes one to a few weeks to design, connect to your existing phone system or CRM, and test, rather than a multi-month platform rollout.",
  },
  {
    question: "Will this replace my existing CRM or phone system?",
    answer:
      "No — these systems are built to connect to the CRM, phone number, and calendar you already use rather than replace them. The automation sits on top of your existing tools and keeps them updated automatically.",
  },
  {
    question: "How is this different from a generic chatbot?",
    answer:
      "A generic chatbot answers questions on a website widget. The systems here are built around a specific business process end-to-end — capturing a lead, qualifying it, updating your CRM, and following up on a schedule — across phone, text, and email, not just a chat window.",
  },
];
