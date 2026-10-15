import { NextResponse } from "next/server";
import { isDbConfigured, logPageView } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: true });
  }

  let body: { path?: string; referrer?: string; visitorId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const path = (body.path ?? "").slice(0, 300);
  if (!path) return NextResponse.json({ ok: true });

  try {
    await logPageView({
      path,
      referrer: body.referrer ? body.referrer.slice(0, 300) : null,
      visitorId: body.visitorId ? body.visitorId.slice(0, 100) : null,
    });
  } catch (err) {
    console.error("Failed to log page view:", err);
  }

  return NextResponse.json({ ok: true });
}
