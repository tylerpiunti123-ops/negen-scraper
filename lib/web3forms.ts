const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const SITE_URL = "https://nextgenclosersai.vercel.app";

export function getWeb3FormsAccessKey(): string | undefined {
  const key = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  return key ? key : undefined;
}

interface Web3FormsSubmission {
  subject: string;
  replyTo?: string;
  fields: Record<string, string>;
}

export interface Web3FormsResult {
  ok: boolean;
  message?: string;
}

export async function sendViaWeb3Forms(
  accessKey: string,
  submission: Web3FormsSubmission,
): Promise<Web3FormsResult> {
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: SITE_URL,
        Referer: `${SITE_URL}/`,
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: submission.subject,
        from_name: "NextGen Closers AI",
        replyto: submission.replyTo,
        ...submission.fields,
      }),
    });

    const text = await res.text();
    const data = (() => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })();

    if (!res.ok || !data?.success) {
      const message = data?.message ?? (text ? text.slice(0, 200) : `HTTP ${res.status}`);
      return { ok: false, message };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Network error." };
  }
}
