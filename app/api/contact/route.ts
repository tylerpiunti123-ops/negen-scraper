import { NextResponse } from "next/server";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/constants";
import { upsertContactFormLead, isDbConfigured } from "@/lib/db";
import { sendEmail, escapeHtml } from "@/lib/email";

export const dynamic = "force-dynamic";

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

async function sendNotificationEmail(payload: ValidatedContact) {
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

  await sendEmail({
    to: CONTACT_NOTIFICATION_EMAIL,
    replyTo: payload.email,
    subject: `New strategy call request — ${payload.business}`,
    html,
  });
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

  if (isDbConfigured()) {
    try {
      await upsertContactFormLead({
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        business: validated.business,
      });
    } catch (err) {
      console.error("Error saving lead to database:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
