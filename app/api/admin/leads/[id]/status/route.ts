import { NextResponse } from "next/server";
import { updateLeadStatus, type LeadStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_STATUSES: LeadStatus[] = ["new", "contacted", "closed_won", "closed_lost"];

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid lead id." }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status as LeadStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await updateLeadStatus(id, body.status as LeadStatus);
  return NextResponse.json({ ok: true });
}
