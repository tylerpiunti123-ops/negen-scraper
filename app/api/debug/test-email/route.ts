import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/constants";
import { getGmailCredentials, getResendApiKey } from "@/lib/email";
import { getWeb3FormsAccessKey, sendViaWeb3Forms } from "@/lib/web3forms";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

function page(body: string) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Email test</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; background: #0a0a0a; color: #f5f5f0; display: flex; min-height: 100vh; align-items: center; justify-content: center; margin: 0; padding: 24px; }
  .card { max-width: 480px; border: 1px solid #333; border-radius: 16px; padding: 32px; background: #141414; }
  h1 { font-size: 18px; margin: 0 0 16px; }
  p { line-height: 1.6; font-size: 15px; color: #ccc; }
  code { background: #222; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  .ok { color: #4ade80; }
  .fail { color: #f87171; }
</style>
</head>
<body>
  <div class="card">${body}</div>
</body>
</html>`;
}

function ok(body: string) {
  return new Response(page(body), { headers: { "Content-Type": "text/html" } });
}

export async function GET() {
  const web3FormsKey = getWeb3FormsAccessKey();
  const gmail = getGmailCredentials();
  const resendKey = getResendApiKey();

  if (!web3FormsKey && !gmail && !resendKey) {
    return ok(`
      <h1 class="fail">❌ No email provider configured</h1>
      <p>Set one of:</p>
      <p><code>WEB3FORMS_ACCESS_KEY</code> (simplest — sends contact-form notifications through Web3Forms)</p>
      <p><code>GMAIL_USER</code> + <code>GMAIL_APP_PASSWORD</code> (sends through your Gmail — also needed for the booking follow-up emails)</p>
      <p><code>RESEND_API_KEY</code> (sends through Resend)</p>
      <p>in Vercel → Settings → Environment Variables, covering Production, then redeploy and try this link again.</p>
    `);
  }

  if (web3FormsKey) {
    const result = await sendViaWeb3Forms(web3FormsKey, {
      subject: "Test email from your site",
      fields: { Message: "This is a test submission from the NextGen Closers AI site, sent through Web3Forms. If you're reading this, it's working." },
    });

    if (result.ok) {
      return ok(`
        <h1 class="ok">✅ Sent (via Web3Forms)</h1>
        <p>Web3Forms accepted it and will email the account registered to this access key.</p>
        <p>Check your inbox (and spam folder) in the next minute or two. Note: Web3Forms only covers contact-form notifications — the automatic booking follow-up emails to leads still need Gmail or Resend configured separately.</p>
      `);
    }

    return ok(`
      <h1 class="fail">❌ Web3Forms rejected it</h1>
      <p><strong>Reason:</strong> ${result.message ?? "No reason given."}</p>
      <p>Double-check the access key in Vercel matches exactly what Web3Forms gave you.</p>
    `);
  }

  if (gmail) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmail.user, pass: gmail.appPassword },
      });
      await transporter.sendMail({
        from: `NextGen Closers AI <${gmail.user}>`,
        to: CONTACT_NOTIFICATION_EMAIL,
        subject: "Test email from your site",
        html: "<p>This is a test email from the NextGen Closers AI site, sent through Gmail. If you're reading this, email sending is working.</p>",
      });
      return ok(`
        <h1 class="ok">✅ Sent (via Gmail)</h1>
        <p>Sent a test email to <strong>${CONTACT_NOTIFICATION_EMAIL}</strong> through <strong>${gmail.user}</strong>.</p>
        <p>Check your inbox (and spam folder) in the next minute or two. If it shows up, the contact form and booking follow-ups will work too.</p>
      `);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error.";
      return ok(`
        <h1 class="fail">❌ Gmail rejected it</h1>
        <p><strong>Reason:</strong> ${message}</p>
        <p>Most common cause: <code>GMAIL_APP_PASSWORD</code> isn't a valid 16-character App Password (your regular Gmail password won't work here), or 2-Step Verification isn't turned on for the Gmail account yet.</p>
      `);
    }
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NextGen Closers AI <onboarding@resend.dev>",
        to: [CONTACT_NOTIFICATION_EMAIL],
        subject: "Test email from your site",
        html: "<p>This is a test email from the NextGen Closers AI site, sent through Resend. If you're reading this, email sending is working.</p>",
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return ok(`
        <h1 class="fail">❌ Resend rejected it</h1>
        <p><strong>Status:</strong> ${res.status}</p>
        <p><strong>Reason:</strong> ${data?.message ?? "No reason given."}</p>
        <p>Most common cause: the key was copy-pasted wrong, or your Resend account hasn't verified anything yet and this address isn't allowed.</p>
      `);
    }

    return ok(`
      <h1 class="ok">✅ Sent (via Resend)</h1>
      <p>Resend accepted it and sent a test email to <strong>${CONTACT_NOTIFICATION_EMAIL}</strong>.</p>
      <p>Check your inbox (and spam folder) in the next minute or two.</p>
    `);
  } catch (err) {
    return ok(`
      <h1 class="fail">❌ Couldn't reach Resend</h1>
      <p>${err instanceof Error ? err.message : "Unknown network error."}</p>
    `);
  }
}
