import { NextResponse } from "next/server";
import { isDbConfigured, listLeads } from "@/lib/db";
import { syncCalendlyBookings } from "@/lib/calendly";
import { processDueFollowUps } from "@/lib/followUpRunner";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured — allow (low-risk, idempotent endpoint)
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ skipped: true, reason: "Database not configured." });
  }

  const syncResult = await syncCalendlyBookings();

  const leads = await listLeads();
  const now = new Date();
  let followUpsSent = 0;
  for (const lead of leads) {
    const sentSteps = await processDueFollowUps(lead, now);
    followUpsSent += sentSteps.length;
  }

  return NextResponse.json({
    newBookings: syncResult.newBookings,
    syncErrors: syncResult.errors,
    followUpsSent,
  });
}
