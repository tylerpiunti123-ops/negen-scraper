import { NextResponse } from "next/server";
import { syncCalendlyBookings } from "@/lib/calendly";

export const dynamic = "force-dynamic";

export async function POST() {
  const result = await syncCalendlyBookings();
  return NextResponse.json(result);
}
