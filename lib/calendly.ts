import { upsertCalendlyLead } from "@/lib/db";
import { sendFollowUpStep } from "@/lib/followUpRunner";

const CALENDLY_API = "https://api.calendly.com";

interface CalendlyQuestionAnswer {
  question: string;
  answer: string;
}

interface CalendlyInvitee {
  name: string;
  email: string;
  status: string;
  text_reminder_number: string | null;
  questions_and_answers: CalendlyQuestionAnswer[];
}

interface CalendlyEvent {
  uri: string;
  start_time: string;
  status: string;
}

async function calendlyFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${CALENDLY_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Calendly API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

function extractPhone(invitee: CalendlyInvitee): string | null {
  const phoneAnswer = invitee.questions_and_answers.find((qa) => /phone/i.test(qa.question));
  return phoneAnswer?.answer ?? invitee.text_reminder_number ?? null;
}

export interface SyncResult {
  newBookings: number;
  errors: string[];
}

export async function syncCalendlyBookings(): Promise<SyncResult> {
  const token = process.env.CALENDLY_API_TOKEN;
  const errors: string[] = [];
  let newBookings = 0;

  if (!token) {
    return { newBookings: 0, errors: ["CALENDLY_API_TOKEN is not set."] };
  }

  try {
    const me = await calendlyFetch<{ resource: { uri: string } }>("/users/me", token);
    const userUri = me.resource.uri;

    const events = await calendlyFetch<{ collection: CalendlyEvent[] }>(
      `/scheduled_events?user=${encodeURIComponent(userUri)}&sort=start_time:desc&count=100`,
      token,
    );

    for (const event of events.collection) {
      if (event.status !== "active") continue;
      const eventUuid = event.uri.split("/").pop();
      try {
        const invitees = await calendlyFetch<{ collection: CalendlyInvitee[] }>(
          `/scheduled_events/${eventUuid}/invitees`,
          token,
        );

        for (const invitee of invitees.collection) {
          if (invitee.status === "canceled") continue;

          const lead = await upsertCalendlyLead({
            name: invitee.name || "there",
            email: invitee.email,
            phone: extractPhone(invitee),
            calendlyEventUri: event.uri,
            callScheduledAt: event.start_time,
          });

          if (lead) {
            newBookings += 1;
            await sendFollowUpStep(lead, 0);
          }
        }
      } catch (err) {
        errors.push(err instanceof Error ? err.message : String(err));
      }
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }

  return { newBookings, errors };
}
