const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: submission.subject,
        from_name: "NextGen Closers AI",
        replyto: submission.replyTo,
        ...submission.fields,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) {
      return { ok: false, message: data?.message ?? `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Network error." };
  }
}
