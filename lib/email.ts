export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Also checks RESEND_API_KE — the variable got saved under that name (missing
// the Y) in Vercel and editing it there hasn't stuck, so this covers the typo
// instead of blocking on a dashboard edit.
export function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY || process.env.RESEND_API_KE;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email send.");
    return false;
  }

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
    console.error("Failed to send email:", res.status, text);
    return false;
  }
  return true;
}
