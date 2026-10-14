export interface ServiceOverviewItem {
  icon: "search" | "phone" | "megaphone" | "sparkles";
  title: string;
  description: string;
}

export const servicesOverviewHeadline = "We meet you where you are.";

export const servicesOverviewIntro =
  "Some shops come to us with nothing. No site, no follow up, no systems. Others are already busy and need ads and automation to keep up. Either way, here is how we work through it.";

export const servicesOverviewItems: ServiceOverviewItem[] = [
  {
    icon: "search",
    title: "Get found.",
    description:
      "A website and Google profile that turn searches into calls. Clean pages, real photos of your work, and a profile that actually shows up when someone searches what you do. No bloated templates, nothing you have to maintain.",
  },
  {
    icon: "phone",
    title: "Never miss a lead.",
    description:
      "The AI receptionist, missed call recovery, and automated follow up you already see on this site. Every call answered, every quote followed up, every lead in your CRM, while you are out on the job.",
  },
  {
    icon: "megaphone",
    title: "Scale with ads.",
    description:
      "Once the site and systems are in place, we run ads that send new work straight into them. The ads and the automation are built together, so every click gets answered, qualified, and booked instead of going to voicemail.",
  },
  {
    icon: "sparkles",
    title: "Show up in AI answers.",
    description:
      "More people ask ChatGPT and Claude who to call instead of searching Google. We structure your website and profiles so those tools can find your business, understand what you do, and recommend you by name when someone asks.",
  },
];
