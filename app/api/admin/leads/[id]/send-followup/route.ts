import { NextResponse } from "next/server";
import { getLead } from "@/lib/db";
import { sendFollowUpStep } from "@/lib/followUpRunner";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid lead id." }, { status: 400 });
  }

  let body: { step?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.step !== "number") {
    return NextResponse.json({ error: "Missing step." }, { status: 400 });
  }

  const lead = await getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  const sent = await sendFollowUpStep(lead, body.step);
  if (!sent) {
    return NextResponse.json(
      { error: "Could not send — it may already have been sent, or email isn't configured." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
