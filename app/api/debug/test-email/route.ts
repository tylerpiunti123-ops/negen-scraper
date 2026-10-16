import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/constants";
import { getResendApiKey } from "@/lib/email";

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

export async function GET() {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    return new Response(
      page(`
        <h1 class="fail">❌ No email key found</h1>
        <p>Neither <code>RESEND_API_KEY</code> nor <code>RESEND_API_KE</code> is set on this deployment, or the deployment hasn't picked it up yet.</p>
        <p>In Vercel → Settings → Environment Variables, make sure one of those has your Resend key as the value, covering Production, then redeploy and try this link again.</p>
      `),
      { headers: { "Content-Type": "text/html" } },
    );
  }

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NextGen Closers AI <onboarding@resend.dev>",
        to: [CONTACT_NOTIFICATION_EMAIL],
        subject: "Test email from your site",
        html: "<p>This is a test email from the NextGen Closers AI site. If you're reading this, email sending is working.</p>",
      }),
    });
  } catch (err) {
    return new Response(
      page(`
        <h1 class="fail">❌ Couldn't reach Resend</h1>
        <p>${err instanceof Error ? err.message : "Unknown network error."}</p>
      `),
      { headers: { "Content-Type": "text/html" } },
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return new Response(
      page(`
        <h1 class="fail">❌ Resend rejected it</h1>
        <p><strong>Status:</strong> ${res.status}</p>
        <p><strong>Reason:</strong> ${data?.message ?? "No reason given."}</p>
        <p>Most common cause: the key was copy-pasted wrong, or your Resend account hasn't verified anything yet and this address isn't allowed. Double-check the key in Resend → API Keys matches what's in Vercel.</p>
      `),
      { headers: { "Content-Type": "text/html" } },
    );
  }

  return new Response(
    page(`
      <h1 class="ok">✅ Sent</h1>
      <p>Resend accepted it and sent a test email to <strong>${CONTACT_NOTIFICATION_EMAIL}</strong>.</p>
      <p>Check your inbox (and spam folder) in the next minute or two. If it shows up, the contact form should work too — if it still doesn't, something else is going on and we'll dig further.</p>
    `),
    { headers: { "Content-Type": "text/html" } },
  );
}
