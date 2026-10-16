import { formatCurrency, formatNumber } from "@/lib/utils";

export interface CalculatorField {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

export interface CalculatorResultCard {
  key: string;
  label: string;
  suffix?: string;
  sub: (results: Record<string, number>) => string;
  accent?: boolean;
}

export interface CalculatorMode {
  id: string;
  tabLabel: string;
  description: string;
  heroLabel: string;
  heroValueKey: string;
  heroSub: (results: Record<string, number>) => string;
  fields: CalculatorField[];
  defaults: Record<string, number>;
  calculate: (inputs: Record<string, number>) => Record<string, number>;
  resultCards: CalculatorResultCard[];
}

function clampPercent(value: number): number {
  return Math.min(Math.max(value, 0), 100) / 100;
}

function v(record: Record<string, number>, key: string): number {
  return record[key] ?? 0;
}

const MISSED_CALL_LOSS_RATE = 0.62;
const RECEPTIONIST_RECOVERY_RATE = 0.35;
const TIME_SAVED_RATE = 0.55;
const SEO_RECOVERY_RATE = 0.45;
const MISSED_CALL_RECOVERY_TEXT_BACK_RATE = 0.4;
const AD_LEAD_RECOVERY_RATE = 0.5;
const WEBSITE_TARGET_CONVERSION_RATE = 0.05;
const WEBSITE_RECOVERY_RATE = 0.6;

const receptionistMode: CalculatorMode = {
  id: "receptionist",
  tabLabel: "AI Receptionist",
  description:
    "Adjust the numbers to reflect your business and see the estimated opportunity in missed leads and manual hours.",
  heroLabel: "Estimated Opportunity You're Currently Missing",
  heroValueKey: "estimatedMissedValue",
  heroSub: (r) =>
    `≈ ${formatCurrency(v(r, "estimatedMissedValue") * 12)} per year at your current numbers — based on ${formatNumber(v(r, "estimatedMissedOpportunities"))} missed opportunities/mo.`,
  fields: [
    { key: "monthlyLeads", label: "Monthly Leads", min: 10, max: 500, step: 5 },
    { key: "avgCustomerValue", label: "Average Customer Value", min: 100, max: 20000, step: 100, prefix: "$" },
    { key: "closeRate", label: "Current Close Rate", min: 5, max: 90, step: 1, suffix: "%" },
    { key: "missedCalls", label: "Missed Calls (per month)", min: 0, max: 150, step: 1 },
    { key: "avgFollowUpMinutes", label: "Avg. Follow-Up Time Per Lead", min: 1, max: 120, step: 1, suffix: " min" },
    { key: "employeesHandlingLeads", label: "Employees Handling Leads", min: 1, max: 20, step: 1 },
  ],
  defaults: {
    monthlyLeads: 120,
    avgCustomerValue: 1800,
    closeRate: 35,
    missedCalls: 25,
    avgFollowUpMinutes: 20,
    employeesHandlingLeads: 2,
  },
  calculate: (inputs) => {
    const closeRateFraction = clampPercent(v(inputs, "closeRate"));
    const avgCustomerValue = v(inputs, "avgCustomerValue");

    const estimatedMissedOpportunities = v(inputs, "missedCalls") * MISSED_CALL_LOSS_RATE;
    const estimatedMissedValue = estimatedMissedOpportunities * avgCustomerValue * closeRateFraction;

    const estimatedTimeSpentHours = (v(inputs, "monthlyLeads") * v(inputs, "avgFollowUpMinutes")) / 60;

    const potentialRecoveredOpportunities = estimatedMissedOpportunities * RECEPTIONIST_RECOVERY_RATE;
    const potentialRecoveredValue =
      potentialRecoveredOpportunities * avgCustomerValue * closeRateFraction;

    const potentialTimeSavedHours = estimatedTimeSpentHours * TIME_SAVED_RATE;

    return {
      estimatedMissedOpportunities,
      estimatedMissedValue,
      estimatedTimeSpentHours,
      potentialRecoveredOpportunities,
      potentialRecoveredValue,
      potentialTimeSavedHours,
    };
  },
  resultCards: [
    {
      key: "estimatedMissedOpportunities",
      label: "Estimated Missed Opportunities",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "estimatedMissedValue"))} in estimated opportunity`,
    },
    {
      key: "estimatedTimeSpentHours",
      label: "Estimated Time Spent",
      suffix: " hrs/mo",
      sub: () => "on manual lead follow-up",
    },
    {
      key: "potentialRecoveredOpportunities",
      label: "Potential Recovered Opportunities",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "potentialRecoveredValue"))} in estimated opportunity`,
      accent: true,
    },
    {
      key: "potentialTimeSavedHours",
      label: "Potential Time Saved",
      suffix: " hrs/mo",
      sub: () => "freed up for your team",
      accent: true,
    },
  ],
};

const aiSeoMode: CalculatorMode = {
  id: "ai-seo",
  tabLabel: "AI SEO",
  description:
    "Adjust the numbers to reflect your business and see the estimated value in jobs you're missing by not showing up when people ask AI tools who to call.",
  heroLabel: "Estimated Opportunity You're Currently Missing",
  heroValueKey: "missedValue",
  heroSub: (r) =>
    `≈ ${formatCurrency(v(r, "missedValue") * 12)} per year at your current numbers — based on ${formatNumber(v(r, "jobsMissed"))} jobs missed/mo.`,
  fields: [
    { key: "avgCustomerValue", label: "Average Customer Value", min: 100, max: 20000, step: 100, prefix: "$" },
    { key: "closeRate", label: "Current Close Rate", min: 5, max: 90, step: 1, suffix: "%" },
    { key: "jobsCouldBeGetting", label: "Jobs You Could Be Getting (per month)", min: 0, max: 60, step: 1 },
  ],
  defaults: {
    avgCustomerValue: 1800,
    closeRate: 35,
    jobsCouldBeGetting: 12,
  },
  calculate: (inputs) => {
    const closeRateFraction = clampPercent(v(inputs, "closeRate"));
    const avgCustomerValue = v(inputs, "avgCustomerValue");

    const jobsMissed = v(inputs, "jobsCouldBeGetting");
    const missedValue = jobsMissed * avgCustomerValue * closeRateFraction;

    const recoveredJobs = jobsMissed * SEO_RECOVERY_RATE;
    const recoveredValue = recoveredJobs * avgCustomerValue * closeRateFraction;

    return { jobsMissed, missedValue, recoveredJobs, recoveredValue };
  },
  resultCards: [
    {
      key: "jobsMissed",
      label: "Jobs You're Missing",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "missedValue"))} in estimated value`,
    },
    {
      key: "recoveredJobs",
      label: "Potential Recovered Jobs",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "recoveredValue"))} in estimated value`,
      accent: true,
    },
  ],
};

const missedCallRecoveryMode: CalculatorMode = {
  id: "missed-call-recovery",
  tabLabel: "Missed Call Recovery",
  description:
    "Adjust the numbers to reflect your business and see the estimated opportunity in missed calls that go cold instead of getting a text back.",
  heroLabel: "Estimated Opportunity You're Currently Missing",
  heroValueKey: "missedValue",
  heroSub: (r) =>
    `≈ ${formatCurrency(v(r, "missedValue") * 12)} per year at your current numbers — based on ${formatNumber(v(r, "missedOpportunities"))} missed calls going cold/mo.`,
  fields: [
    { key: "avgCustomerValue", label: "Average Customer Value", min: 100, max: 20000, step: 100, prefix: "$" },
    { key: "closeRate", label: "Current Close Rate", min: 5, max: 90, step: 1, suffix: "%" },
    { key: "missedCalls", label: "Missed Calls (per month)", min: 0, max: 150, step: 1 },
  ],
  defaults: {
    avgCustomerValue: 1800,
    closeRate: 35,
    missedCalls: 25,
  },
  calculate: (inputs) => {
    const closeRateFraction = clampPercent(v(inputs, "closeRate"));
    const avgCustomerValue = v(inputs, "avgCustomerValue");

    const missedOpportunities = v(inputs, "missedCalls") * MISSED_CALL_LOSS_RATE;
    const missedValue = missedOpportunities * avgCustomerValue * closeRateFraction;

    const recoveredOpportunities = missedOpportunities * MISSED_CALL_RECOVERY_TEXT_BACK_RATE;
    const recoveredValue = recoveredOpportunities * avgCustomerValue * closeRateFraction;

    return { missedOpportunities, missedValue, recoveredOpportunities, recoveredValue };
  },
  resultCards: [
    {
      key: "missedOpportunities",
      label: "Missed Calls Going Cold",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "missedValue"))} in estimated opportunity`,
    },
    {
      key: "recoveredOpportunities",
      label: "Potential Recovered Leads",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "recoveredValue"))} in estimated opportunity`,
      accent: true,
    },
  ],
};

const adsMode: CalculatorMode = {
  id: "ads",
  tabLabel: "Ads",
  description:
    "Adjust the numbers to reflect your ad spend and see how much is going to waste on leads that never get a timely response.",
  heroLabel: "Estimated Ad Spend Going To Waste",
  heroValueKey: "wastedAdSpend",
  heroSub: (r) =>
    `≈ ${formatCurrency(v(r, "wastedAdSpend") * 12)} per year at your current numbers — based on ${formatNumber(v(r, "leadsWasted"))} of your ${formatNumber(v(r, "monthlyAdLeads"))} ad leads/mo going unanswered.`,
  fields: [
    { key: "monthlyAdSpend", label: "Monthly Ad Spend", min: 500, max: 20000, step: 100, prefix: "$" },
    { key: "costPerLead", label: "Cost Per Lead", min: 10, max: 500, step: 5, prefix: "$" },
    { key: "avgCustomerValue", label: "Average Customer Value", min: 100, max: 20000, step: 100, prefix: "$" },
    { key: "closeRate", label: "Current Close Rate", min: 5, max: 90, step: 1, suffix: "%" },
    { key: "unansweredRate", label: "Leads That Go Unanswered", min: 0, max: 80, step: 5, suffix: "%" },
  ],
  defaults: {
    monthlyAdSpend: 4000,
    costPerLead: 50,
    avgCustomerValue: 1800,
    closeRate: 35,
    unansweredRate: 30,
  },
  calculate: (inputs) => {
    const closeRateFraction = clampPercent(v(inputs, "closeRate"));
    const avgCustomerValue = v(inputs, "avgCustomerValue");
    const monthlyAdSpend = v(inputs, "monthlyAdSpend");
    const costPerLead = v(inputs, "costPerLead");

    const monthlyAdLeads = costPerLead > 0 ? monthlyAdSpend / costPerLead : 0;
    const leadsWasted = monthlyAdLeads * clampPercent(v(inputs, "unansweredRate"));
    const wastedAdSpend = leadsWasted * costPerLead;
    const missedValue = leadsWasted * avgCustomerValue * closeRateFraction;

    const recoveredLeads = leadsWasted * AD_LEAD_RECOVERY_RATE;
    const recoveredValue = recoveredLeads * avgCustomerValue * closeRateFraction;

    return {
      monthlyAdLeads,
      costPerLead,
      leadsWasted,
      wastedAdSpend,
      missedValue,
      recoveredLeads,
      recoveredValue,
    };
  },
  resultCards: [
    {
      key: "monthlyAdLeads",
      label: "Leads Your Ad Spend Generates",
      suffix: "/mo",
      sub: (r) => `${formatCurrency(v(r, "costPerLead"))} per lead at your current spend`,
    },
    {
      key: "leadsWasted",
      label: "Leads Going Unanswered",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "missedValue"))} in estimated opportunity`,
    },
    {
      key: "recoveredLeads",
      label: "Potential Recovered Leads",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "recoveredValue"))} in estimated opportunity`,
      accent: true,
    },
  ],
};

const websitesMode: CalculatorMode = {
  id: "websites",
  tabLabel: "Websites",
  description:
    "Adjust the numbers to reflect your search volume and see how many leads a stronger site and Google profile could be converting.",
  heroLabel: "Estimated Opportunity You're Currently Missing",
  heroValueKey: "missedValue",
  heroSub: (r) =>
    `≈ ${formatCurrency(v(r, "missedValue") * 12)} per year at your current numbers — based on ${formatNumber(v(r, "gapLeads"))} leads/mo your site isn't converting.`,
  fields: [
    { key: "monthlySearches", label: "Monthly Searches For Your Service", min: 50, max: 5000, step: 50 },
    { key: "siteConversionRate", label: "Current Site Conversion Rate", min: 0, max: 20, step: 1, suffix: "%" },
    { key: "avgCustomerValue", label: "Average Customer Value", min: 100, max: 20000, step: 100, prefix: "$" },
    { key: "closeRate", label: "Current Close Rate", min: 5, max: 90, step: 1, suffix: "%" },
  ],
  defaults: {
    monthlySearches: 400,
    siteConversionRate: 2,
    avgCustomerValue: 1800,
    closeRate: 35,
  },
  calculate: (inputs) => {
    const closeRateFraction = clampPercent(v(inputs, "closeRate"));
    const avgCustomerValue = v(inputs, "avgCustomerValue");
    const monthlySearches = v(inputs, "monthlySearches");

    const currentLeads = monthlySearches * clampPercent(v(inputs, "siteConversionRate"));
    const potentialLeads = monthlySearches * WEBSITE_TARGET_CONVERSION_RATE;
    const gapLeads = Math.max(potentialLeads - currentLeads, 0);
    const missedValue = gapLeads * avgCustomerValue * closeRateFraction;

    const recoveredLeads = gapLeads * WEBSITE_RECOVERY_RATE;
    const recoveredValue = recoveredLeads * avgCustomerValue * closeRateFraction;

    return { gapLeads, missedValue, recoveredLeads, recoveredValue };
  },
  resultCards: [
    {
      key: "gapLeads",
      label: "Leads Your Site Isn't Converting",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "missedValue"))} in estimated opportunity`,
    },
    {
      key: "recoveredLeads",
      label: "Potential Recovered Leads",
      suffix: "/mo",
      sub: (r) => `≈ ${formatCurrency(v(r, "recoveredValue"))} in estimated opportunity`,
      accent: true,
    },
  ],
};

export const calculatorModes: CalculatorMode[] = [
  receptionistMode,
  missedCallRecoveryMode,
  aiSeoMode,
  adsMode,
  websitesMode,
];
