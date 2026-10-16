import { NextResponse } from "next/server";
import { syncCalendlyBookings } from "@/lib/calendly";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  const result = await syncCalendlyBookings();
  return NextResponse.json(result);
}
