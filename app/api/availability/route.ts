import { NextResponse } from "next/server";
import { getEvents } from "@/lib/calendar";
import { freeWindowsBetween } from "@/lib/calendar/availability";
import { addDays } from "@/lib/utils/format";
import { today } from "@/lib/repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? today();
  const days = Math.min(31, Number(searchParams.get("days") ?? 14));
  const min = Number(searchParams.get("min") ?? 150);
  const events = await getEvents(from, addDays(from, days));
  return NextResponse.json(freeWindowsBetween(events, from, days, min));
}
