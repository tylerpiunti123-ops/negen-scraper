import type { Lead } from "@/lib/db";
import { logFollowUpSent, getFollowUpHistory } from "@/lib/db";
import { followUpSequence, getStep, isStepDue } from "@/lib/followUpSequence";
import { sendEmail } from "@/lib/email";

export async function sendFollowUpStep(lead: Lead, step: number): Promise<boolean> {
  const stepDef = getStep(step);
  if (!stepDef) return false;

  const history = await getFollowUpHistory(lead.id);
  if (history.some((h) => h.step === step)) return false; // already sent

  const sent = await sendEmail({
    to: lead.email,
    subject: stepDef.subject,
    html: stepDef.buildHtml(lead),
  });
  if (!sent) return false;

  await logFollowUpSent(lead.id, step);
  return true;
}

export async function processDueFollowUps(lead: Lead, now: Date = new Date()): Promise<number[]> {
  if (lead.source !== "calendly") return [];
  if (lead.status === "closed_won" || lead.status === "closed_lost") return [];

  const history = await getFollowUpHistory(lead.id);
  const sentSteps = new Set(history.map((h) => h.step));
  const sentNow: number[] = [];

  for (const step of followUpSequence) {
    if (sentSteps.has(step.step)) continue;
    if (!isStepDue(step, lead, now)) continue;
    const sent = await sendFollowUpStep(lead, step.step);
    if (sent) sentNow.push(step.step);
  }

  return sentNow;
}
