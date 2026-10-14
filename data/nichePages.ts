export interface NichePageContent {
  slug: string;
  navLabel: string;
  niche: string;
  title: string;
  subtitle: string;
  whatItIs: string;
  bottlenecks: string[];
  systems: { label: string; description: string; demoId?: string }[];
  howItWorks: string[];
  costNote: string;
  metaTitle: string;
  metaDescription: string;
}

export const nichePages: NichePageContent[] = [
  {
    slug: "epoxy-flooring",
    navLabel: "Epoxy Flooring",
    niche: "Epoxy Flooring",
    title: "AI Automation for Epoxy Flooring Companies",
    subtitle: "Built around how epoxy and garage floor coating businesses actually run.",
    whatItIs:
      "Epoxy flooring jobs come from a phone that doesn't stop ringing while your hands are covered in resin, and quotes big enough that a slow follow-up loses the job to whoever calls back first. This is the automation built around that reality — not a generic chatbot bolted onto a website.",
    bottlenecks: [
      "Calls come in while you're mid-pour and can't answer — and most callers don't leave a voicemail",
      "Quotes for a full garage or shop floor are a real investment, so customers shop around while they wait to hear back",
      "Reviews matter for this trade more than most, and they rarely happen unless someone asks right after the job",
    ],
    systems: [
      {
        label: "AI Receptionist",
        description: "Answers every call while you're on the job and books the estimate.",
        demoId: "receptionist",
      },
      {
        label: "Missed Call Recovery",
        description: "Texts back anyone you couldn't get to and keeps the conversation going.",
        demoId: "missed-call",
      },
      {
        label: "Quote Follow-Up",
        description: "Automatically chases a stale quote before the customer books someone else.",
        demoId: "quote-followup",
      },
      {
        label: "AI SEO",
        description: "Shows up when someone asks AI tools for an epoxy flooring recommendation.",
        demoId: "ai-seo",
      },
    ],
    howItWorks: [
      "We map where leads are actually being lost — missed calls, slow quote follow-up, or both",
      "We build the specific systems that address it, using your real pricing and service details",
      "It connects to the phone number, CRM, and calendar you already use",
      "You keep working the floor; the system keeps working the leads",
    ],
    costNote:
      "Most epoxy flooring businesses start with one or two systems — commonly an AI receptionist and quote follow-up — rather than the full platform. Ask for a quote scoped to your business.",
    metaTitle: "AI Automation for Epoxy Flooring Companies",
    metaDescription:
      "AI receptionist, missed call recovery, and quote follow-up built around how epoxy and garage floor coating businesses actually run.",
  },
  {
    slug: "pavers",
    navLabel: "Pavers",
    niche: "Pavers",
    title: "AI Automation for Paver & Hardscape Companies",
    subtitle: "Built around seasonal demand and a quoting process that takes real time.",
    whatItIs:
      "Paver and hardscape jobs don't get quoted over the phone — someone has to see the site. That gap between the first call and the actual estimate is where this kind of business usually loses leads, especially during the few months a year when every homeowner wants a patio at once.",
    bottlenecks: [
      "Demand spikes hard in-season, and the phone gets more calls than one person can field",
      "A real quote needs a site visit, so there's a multi-day gap where the lead can go cold",
      "Follow-up after the estimate is the first thing that gets skipped when the crew is busy installing",
    ],
    systems: [
      {
        label: "AI Receptionist",
        description: "Handles the call volume spike and books the site visit.",
        demoId: "receptionist",
      },
      {
        label: "Lead Follow-Up",
        description: "Keeps the lead warm on a fixed cadence between the call and the site visit.",
        demoId: "lead-followup",
      },
      {
        label: "Quote Follow-Up",
        description: "Chases the estimate automatically so it doesn't die waiting on a reply.",
        demoId: "quote-followup",
      },
      {
        label: "Customer Reactivation",
        description: "Brings back past customers for seal-coating, repairs, or new projects.",
        demoId: "reactivation",
      },
    ],
    howItWorks: [
      "We map your actual quote-to-close timeline and find where leads stall out",
      "We build automation around the site-visit gap specifically, not a generic funnel",
      "It connects to your existing phone, CRM, and calendar",
      "Follow-up keeps running automatically through your busiest months",
    ],
    costNote:
      "Most paver and hardscape businesses start with lead follow-up and quote follow-up first, since that's where estimates are usually lost. Ask for a quote scoped to your business.",
    metaTitle: "AI Automation for Paver & Hardscape Companies",
    metaDescription:
      "AI receptionist, lead follow-up, and quote follow-up built around seasonal demand and the site-visit gap in paver and hardscape sales.",
  },
  {
    slug: "painters",
    navLabel: "Painters",
    niche: "Painters",
    title: "AI Automation for Painting Companies",
    subtitle: "Built around juggling crews, job sites, and a phone that never stops.",
    whatItIs:
      "Running a painting company means being on a ladder, not at a desk — and the phone call you miss while cutting in a ceiling is a customer who's already calling the next painter on their list. This is the automation built around that specific problem, not a generic answering service script.",
    bottlenecks: [
      "Calls come in constantly while you're on-site and can't step away",
      "Estimates depend on scope (interior, exterior, square footage) that's hard to capture in a voicemail",
      "Scheduling across multiple crews and jobs makes it easy for a follow-up to fall through",
    ],
    systems: [
      {
        label: "AI Receptionist",
        description: "Answers while you're mid-job and captures the scope of the work.",
        demoId: "receptionist",
      },
      {
        label: "Missed Call Recovery",
        description: "Texts back every missed call before the customer calls a competitor.",
        demoId: "missed-call",
      },
      {
        label: "Lead Follow-Up",
        description: "Keeps new inquiries moving on a schedule your crews don't have time to manage.",
        demoId: "lead-followup",
      },
      {
        label: "AI SEO",
        description: "Shows up when someone asks AI tools for the best painting company nearby.",
        demoId: "ai-seo",
      },
    ],
    howItWorks: [
      "We map how leads move from first call to booked job today",
      "We build the specific systems that close the gaps — usually missed calls and slow follow-up first",
      "It connects to your existing phone number, CRM, and calendar",
      "You stay on the ladder; the system keeps the pipeline moving",
    ],
    costNote:
      "Most painting companies start with an AI receptionist and missed call recovery together, since both address the same root problem. Ask for a quote scoped to your business.",
    metaTitle: "AI Automation for Painting Companies",
    metaDescription:
      "AI receptionist and missed call recovery built around how painting companies actually operate — crews on-site, phones unanswered, estimates lost to slow follow-up.",
  },
  {
    slug: "water-restoration",
    navLabel: "Water Restoration",
    niche: "Water Restoration",
    title: "AI Automation for Water Restoration Companies",
    subtitle: "Built for a business where every call is an emergency and speed is the whole pitch.",
    whatItIs:
      "Water damage doesn't wait for business hours, and the company that picks up first is usually the company that gets the job. This is automation built around genuine urgency — immediate response, clear next steps for the customer, and a fast handoff to your team, not a standard business-hours answering script.",
    bottlenecks: [
      "Most calls come in nights, weekends, and holidays — exactly when a business is least staffed",
      "Customers in an active emergency are Googling or asking AI tools for help right now, not researching later",
      "A slow response on a true emergency loses the job immediately, not eventually",
    ],
    systems: [
      {
        label: "AI Receptionist",
        description: "Answers immediately, any hour, and dispatches a qualified emergency lead.",
        demoId: "receptionist",
      },
      {
        label: "Missed Call Recovery",
        description: "Texts back instantly if a call is ever missed during a surge.",
        demoId: "missed-call",
      },
      {
        label: "AI SEO",
        description: "Positioned to be the business recommended when someone asks AI tools what to do in a water emergency.",
        demoId: "ai-seo",
      },
      {
        label: "Customer Reactivation",
        description: "Re-engages past customers for mitigation, mold checks, or repeat events.",
        demoId: "reactivation",
      },
    ],
    howItWorks: [
      "We map your actual after-hours and emergency call handling today",
      "We build a system that responds immediately, any hour, and routes true emergencies to your team fast",
      "It connects to your existing emergency line, CRM, and dispatch process",
      "Response time becomes consistent whether it's 2pm or 2am",
    ],
    costNote:
      "Water restoration businesses typically prioritize an always-on AI receptionist first, since response speed is the single biggest factor in winning the job. Ask for a quote scoped to your business.",
    metaTitle: "AI Automation for Water Restoration Companies",
    metaDescription:
      "Always-on AI receptionist and missed call recovery built for a business where every call is an emergency and response speed wins the job.",
  },
];
