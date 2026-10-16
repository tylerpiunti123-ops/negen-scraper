import nodemailer from "nodemailer";

function cleanEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getGmailCredentials(): { user: string; appPassword: string } | null {
  const user = cleanEnv(process.env.GMAIL_USER);
  const appPassword = cleanEnv(process.env.GMAIL_APP_PASSWORD);
  if (!user || !appPassword) return null;
  return { user, appPassword };
}

// Also checks RESEND_API_KE — the variable got saved under that name (missing
// the Y) in Vercel and editing it there hasn't stuck, so this covers the typo
// instead of blocking on a dashboard edit.
export function getResendApiKey(): string | undefined {
  return cleanEnv(process.env.RESEND_API_KEY) || cleanEnv(process.env.RESEND_API_KE);
}

export type EmailProvider = "gmail" | "resend" | "none";

export function getActiveEmailProvider(): EmailProvider {
  if (getGmailCredentials()) return "gmail";
  if (getResendApiKey()) return "resend";
  return "none";
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

let gmailTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getGmailTransporter(user: string, appPassword: string) {
  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: appPassword },
    });
  }
  return gmailTransporter;
}

async function sendViaGmail(
  input: SendEmailInput,
  credentials: { user: string; appPassword: string },
): Promise<boolean> {
  try {
    const transporter = getGmailTransporter(credentials.user, credentials.appPassword);
    await transporter.sendMail({
      from: `NextGen Closers AI <${credentials.user}>`,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      html: input.html,
    });
    return true;
  } catch (err) {
    console.error("Failed to send email via Gmail:", err);
    return false;
  }
}

async function sendViaResend(input: SendEmailInput, apiKey: string): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "NextGen Closers AI <onboarding@resend.dev>",
      to: [input.to],
      reply_to: input.replyTo,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Failed to send email via Resend:", res.status, text);
    return false;
  }
  return true;
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const gmail = getGmailCredentials();
  if (gmail) {
    return sendViaGmail(input, gmail);
  }

  const resendKey = getResendApiKey();
  if (resendKey) {
    return sendViaResend(input, resendKey);
  }

  console.warn("No email provider configured (GMAIL_USER/GMAIL_APP_PASSWORD or RESEND_API_KEY) — skipping email send.");
  return false;
}
