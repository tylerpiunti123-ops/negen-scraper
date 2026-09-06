export const activityTemplates: string[] = [
  "New lead captured",
  "AI qualification completed",
  "CRM updated",
  "Appointment opportunity created",
  "Follow-up scheduled",
  "Missed call recovered via SMS",
  "Quote follow-up sent",
  "Review request sent",
  "Reactivation message delivered",
  "Lead moved to Qualified stage",
];

export interface DashboardMetric {
  label: string;
  value: number;
  suffix?: string;
}

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Leads Processed", value: 247 },
  { label: "Conversations", value: 89 },
  { label: "Appointments", value: 63 },
  { label: "Follow-Ups", value: 1284 },
];
