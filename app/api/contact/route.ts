import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  business?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  automate?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, business, email, phone, industry, automate } = payload;

  if (!name?.trim() || !business?.trim() || !email?.trim() || !phone?.trim() || !industry?.trim() || !automate?.trim()) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  // In production this would forward to a CRM, inbox, or notification service.
  console.log("New strategy call request:", payload);

  return NextResponse.json({ ok: true });
}
