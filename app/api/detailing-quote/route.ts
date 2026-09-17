import { NextResponse } from "next/server";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/constants";

interface QuotePayload {
  vehicle?: { type?: string; year?: string; make?: string; model?: string };
  needs?: string[];
  photoCount?: number;
  contact?: { name?: string; email?: string; phone?: string; notes?: string };
}

interface ValidatedQuote {
  vehicle: { type: string; year: string; make: string; model: string };
  needs: string[];
  photoCount: number;
  contact: { name: string; email: string; phone: string; notes: string };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendNotificationEmail(payload: ValidatedQuote) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email notification.");
    return;
  }

  const rows: [string, string][] = [
    ["Name", payload.contact.name],
    ["Email", payload.contact.email],
    ["Phone", payload.contact.phone],
    ["Vehicle", [payload.vehicle.year, payload.vehicle.make, payload.vehicle.model].filter(Boolean).join(" ") || "—"],
    ["Vehicle type", payload.vehicle.type || "—"],
    ["Needs", payload.needs.join(", ") || "—"],
    ["Photos attached", String(payload.photoCount)],
    ["Notes", payload.contact.notes || "—"],
  ];

  const html = `
    <h2>New detailing quote request</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="font-weight:600;vertical-align:top">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Apex Auto Detailing <onboarding@resend.dev>",
      to: [CONTACT_NOTIFICATION_EMAIL],
      reply_to: payload.contact.email,
      subject: `New detailing quote request — ${payload.contact.name}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Failed to send notification email:", res.status, text);
  }
}

export async function POST(request: Request) {
  let payload: QuotePayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { vehicle, needs, photoCount, contact } = payload;

  if (!contact?.name?.trim() || !contact?.email?.trim() || !contact?.phone?.trim()) {
    return NextResponse.json({ error: "Missing required contact fields." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(contact.email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const validated: ValidatedQuote = {
    vehicle: {
      type: vehicle?.type?.trim() ?? "",
      year: vehicle?.year?.trim() ?? "",
      make: vehicle?.make?.trim() ?? "",
      model: vehicle?.model?.trim() ?? "",
    },
    needs: Array.isArray(needs) ? needs.filter((n): n is string => typeof n === "string") : [],
    photoCount: typeof photoCount === "number" ? photoCount : 0,
    contact: {
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      notes: contact.notes?.trim() ?? "",
    },
  };

  console.log("New detailing quote request:", validated);

  try {
    await sendNotificationEmail(validated);
  } catch (err) {
    console.error("Error sending notification email:", err);
  }

  return NextResponse.json({ ok: true });
}
