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

export const calculatorModes: CalculatorMode[] = [receptionistMode, aiSeoMode];
