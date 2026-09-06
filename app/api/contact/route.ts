import { NextResponse } from "next/server";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/constants";

interface ContactPayload {
  name?: string;
  business?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  automate?: string;
}

interface ValidatedContact {
  name: string;
  business: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  automate: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendNotificationEmail(payload: ValidatedContact) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email notification.");
    return;
  }

  const rows: [string, string][] = [
    ["Name", payload.name],
    ["Business", payload.business],
    ["Email", payload.email],
    ["Phone", payload.phone],
    ["Website", payload.website || "—"],
    ["Industry", payload.industry],
    ["What they want to automate", payload.automate],
  ];

  const html = `
    <h2>New strategy call request</h2>
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
      from: "NextGen Closers AI <onboarding@resend.dev>",
      to: [CONTACT_NOTIFICATION_EMAIL],
      reply_to: payload.email,
      subject: `New strategy call request — ${payload.business}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Failed to send notification email:", res.status, text);
  }
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, business, email, phone, website, industry, automate } = payload;

  if (!name?.trim() || !business?.trim() || !email?.trim() || !phone?.trim() || !industry?.trim() || !automate?.trim()) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const validated: ValidatedContact = {
    name: name.trim(),
    business: business.trim(),
    email: email.trim(),
    phone: phone.trim(),
    website: website?.trim() ?? "",
    industry: industry.trim(),
    automate: automate.trim(),
  };

  console.log("New strategy call request:", validated);

  try {
    await sendNotificationEmail(validated);
  } catch (err) {
    console.error("Error sending notification email:", err);
  }

  return NextResponse.json({ ok: true });
}
