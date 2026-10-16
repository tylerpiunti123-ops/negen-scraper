import { upsertCalendlyLead } from "@/lib/db";
import { sendFollowUpStep } from "@/lib/followUpRunner";

const CALENDLY_API = "https://api.calendly.com";
const EVENTS_PER_SYNC = 50;
const DELAY_BETWEEN_INVITEE_CALLS_MS = 600;

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function calendlyFetch<T>(path: string, token: string, retrying = false): Promise<T> {
  const res = await fetch(`${CALENDLY_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 429 && !retrying) {
    const retryAfterHeader = res.headers.get("Retry-After");
    const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 3000;
    await sleep(Number.isFinite(retryAfterMs) ? retryAfterMs : 3000);
    return calendlyFetch<T>(path, token, true);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Calendly API error ${res.status}${text ? `: ${text}` : ""}`);
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
  let newBookings = 0;
  const errorCounts = new Map<string, number>();

  function recordError(message: string) {
    errorCounts.set(message, (errorCounts.get(message) ?? 0) + 1);
  }

  if (!token) {
    return { newBookings: 0, errors: ["CALENDLY_API_TOKEN is not set."] };
  }

  try {
    const me = await calendlyFetch<{ resource: { uri: string } }>("/users/me", token);
    const userUri = me.resource.uri;

    const events = await calendlyFetch<{ collection: CalendlyEvent[] }>(
      `/scheduled_events?user=${encodeURIComponent(userUri)}&sort=start_time:desc&count=${EVENTS_PER_SYNC}`,
      token,
    );

    for (const event of events.collection) {
      if (event.status !== "active") continue;
      const eventUuid = event.uri.split("/").pop();

      await sleep(DELAY_BETWEEN_INVITEE_CALLS_MS);

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
        recordError(err instanceof Error ? err.message : String(err));
      }
    }
  } catch (err) {
    recordError(err instanceof Error ? err.message : String(err));
  }

  const errors = Array.from(errorCounts.entries()).map(([message, count]) =>
    count > 1 ? `${message} (×${count})` : message,
  );

  return { newBookings, errors };
}
