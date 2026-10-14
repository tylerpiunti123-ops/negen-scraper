export interface ServicePageContent {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  whatItIs: string;
  whoItsFor: string[];
  howItWorks: string[];
  costNote: string;
  demoId: string;
  demoLabel: string;
  metaTitle: string;
  metaDescription: string;
}

export const servicePages: ServicePageContent[] = [
  {
    slug: "ai-receptionist",
    navLabel: "AI Receptionist",
    eyebrow: "Service",
    title: "AI Receptionist",
    subtitle: "Answers every call, text, and web inquiry in real time — day or night.",
    whatItIs:
      "An AI receptionist is a conversational system that answers inbound calls, texts, and web chats the moment they come in, asks the same qualifying questions a trained front-desk employee would, and either books the appointment directly or hands off a qualified lead to your team. It connects to the phone number and messaging channels you already use — it doesn't replace them.",
    whoItsFor: [
      "Businesses that get inbound calls or messages outside business hours",
      "Teams without a dedicated front desk, or where the person answering the phone is also doing the job",
      "Any business that's lost a lead because nobody picked up in time",
    ],
    howItWorks: [
      "Connects to your existing phone number and messaging channels — no new number to give out",
      "Answers using conversation logic built around your specific services and common questions",
      "Qualifies the caller: service needed, scope, budget, timeline",
      "Books directly to your calendar or hands off a qualified lead to your team",
      "Every conversation logs to your CRM automatically",
    ],
    costNote:
      "A single-channel AI receptionist is typically the least expensive system to deploy, since it's scoped to one job: answering and qualifying. Pricing scales with how many channels (phone, text, web chat) and how much custom conversation logic you need — ask for a quote based on your setup.",
    demoId: "receptionist",
    demoLabel: "AI Receptionist",
    metaTitle: "AI Receptionist for Service Businesses",
    metaDescription:
      "An AI receptionist that answers every call, text, and web inquiry in real time, qualifies the lead, and books the appointment — connected to the phone and CRM you already use.",
  },
  {
    slug: "missed-call-recovery",
    navLabel: "Missed Call Recovery",
    eyebrow: "Service",
    title: "Missed Call Recovery",
    subtitle: "Turns every missed call into a text conversation instead of a lost lead.",
    whatItIs:
      "Missed call recovery is a system that automatically texts back anyone whose call you miss, continues the conversation naturally, and captures and qualifies the lead — so a missed call never just disappears. It triggers off your existing phone line the moment a call goes unanswered.",
    whoItsFor: [
      "Businesses that can't always answer the phone — on a job site, mid-appointment, or short-staffed",
      "Anyone who's noticed missed calls rarely call back a second time",
      "Businesses already paying for ads or marketing that drives phone calls they sometimes miss",
    ],
    howItWorks: [
      "A call goes unanswered and the system detects it within seconds",
      "An automatic text goes out: \"Sorry we missed your call, how can we help?\"",
      "The AI continues the conversation and qualifies the lead",
      "Your CRM updates and your team gets notified",
      "An appointment is offered before the conversation ends",
    ],
    costNote:
      "Missed call recovery is usually one of the lower-cost systems to deploy, since it's a single automated response triggered off your existing phone line rather than a full multi-channel build. Ask for a quote based on your call volume.",
    demoId: "missed-call",
    demoLabel: "Missed Call Recovery",
    metaTitle: "Missed Call Recovery for Service Businesses",
    metaDescription:
      "Automatically text back every missed call, continue the conversation, and capture the lead — before the caller tries a competitor instead.",
  },
  {
    slug: "ai-seo",
    navLabel: "AI SEO",
    eyebrow: "Service",
    title: "AI SEO",
    subtitle: "Positioned to be the business AI assistants actually recommend.",
    whatItIs:
      "AI SEO is the technical and content work that determines whether ChatGPT, Claude, Google AI, and similar tools recommend your business by name when someone asks for help in your category — things like structured data (Schema.org), FAQ content written in the format these tools quote directly, and the basic technical groundwork (crawlability, indexing, a sitemap) that lets them find and understand your site in the first place.",
    whoItsFor: [
      "Any business that wants to show up when a customer asks an AI assistant who to call",
      "Businesses already investing in a website that isn't structured for AI tools to parse",
      "Businesses that want to be found without bidding for every click on a traditional ad platform",
    ],
    howItWorks: [
      "Structured data (Schema.org) is added describing exactly what your business does and who it serves",
      "FAQ content is written to directly answer the real questions people ask, in a format AI tools quote from",
      "Technical fundamentals are fixed — sitemap, indexing, crawlability, consistent business info",
      "Your business is made consistent across the directories and profiles AI tools cross-reference",
      "Results are checked monthly against real AI assistant queries and adjusted",
    ],
    costNote:
      "AI SEO work is priced around the scope of content and structured data needed — a straightforward service business with a handful of pages costs less than a multi-location or multi-service operation. Ask for a quote scoped to your site.",
    demoId: "ai-seo",
    demoLabel: "AI SEO",
    metaTitle: "AI SEO — Get Recommended by ChatGPT, Claude & Google AI",
    metaDescription:
      "Structured data, FAQ content, and technical fundamentals built so AI assistants can find, understand, and recommend your business by name.",
  },
];
