import type { Lead } from "@/lib/db";
import { escapeHtml } from "@/lib/html";

const SITE_URL = "https://nextgenclosersai.vercel.app";

export interface FollowUpStep {
  step: number;
  anchor: "booked" | "call";
  offsetDays: number;
  label: string;
  subject: string;
  buildHtml: (lead: Lead) => string;
}

function firstName(lead: Lead): string {
  return lead.name.trim().split(/\s+/)[0] || "there";
}

function wrap(body: string): string {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:560px">
      ${body}
      <p style="margin-top:28px;color:#555">
        — Tyler<br/>NextGen Closers AI
      </p>
    </div>
  `;
}

export const followUpSequence: FollowUpStep[] = [
  {
    step: 0,
    anchor: "booked",
    offsetDays: 0,
    label: "Booking confirmation",
    subject: "You're booked — quick heads up before our call",
    buildHtml: (lead) =>
      wrap(`
        <p>Hey ${escapeHtml(firstName(lead))},</p>
        <p>Thanks for booking a call — looking forward to it.</p>
        <p>In the meantime, feel free to try the live AI demos on the site so you can see exactly what we're talking about on the call:</p>
        <p><a href="${SITE_URL}/#demos" style="color:#d97706">${SITE_URL}/#demos</a></p>
        <p>If anything changes on your end, just reply to this email.</p>
      `),
  },
  {
    step: 1,
    anchor: "call",
    offsetDays: 1,
    label: "Day after the call",
    subject: "Good talking with you",
    buildHtml: (lead) =>
      wrap(`
        <p>Hey ${escapeHtml(firstName(lead))},</p>
        <p>Good talking yesterday. Wanted to follow up while it's still fresh — let me know if you had any questions come up after we hung up, or if you want me to send anything over.</p>
      `),
  },
  {
    step: 2,
    anchor: "call",
    offsetDays: 4,
    label: "Check-in",
    subject: "Checking in",
    buildHtml: (lead) =>
      wrap(`
        <p>Hey ${escapeHtml(firstName(lead))},</p>
        <p>Just checking in — any thoughts since we talked? Happy to answer anything or jump on a quick follow-up call if that's easier than email.</p>
      `),
  },
  {
    step: 3,
    anchor: "call",
    offsetDays: 10,
    label: "Final nudge",
    subject: "Still here when you're ready",
    buildHtml: (lead) =>
      wrap(`
        <p>Hey ${escapeHtml(firstName(lead))},</p>
        <p>Haven't heard back, so I'll keep this short — no pressure either way. If the timing's not right, let me know and I'll stop following up. If you're still interested, just reply and we'll pick up where we left off.</p>
      `),
  },
];

export function getStep(step: number): FollowUpStep | undefined {
  return followUpSequence.find((s) => s.step === step);
}

export function isStepDue(step: FollowUpStep, lead: Lead, now: Date): boolean {
  const anchorTime = step.anchor === "call" ? lead.call_scheduled_at : lead.created_at;
  if (!anchorTime) return false;
  const anchorDate = new Date(anchorTime);
  const dueDate = new Date(anchorDate.getTime() + step.offsetDays * 24 * 60 * 60 * 1000);
  return now >= dueDate;
}
