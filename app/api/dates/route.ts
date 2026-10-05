import { NextResponse } from "next/server";
import type { AgendaItem } from "@/types";
import { savePlan } from "@/lib/repository";

/** Plan a date. Kept in memory for now — a Notion "Dates" database later. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    ideaIds?: string[];
    agenda?: AgendaItem[];
    notes?: string;
  } | null;
  if (!body?.title || !/^\d{4}-\d{2}-\d{2}$/.test(body.date ?? "") || !/^\d{2}:\d{2}$/.test(body.startTime ?? "")) {
    return NextResponse.json({ error: "A plan needs a name, a day and a start time." }, { status: 400 });
  }
  const plan = await savePlan({
    title: body.title.slice(0, 80),
    date: body.date!,
    startTime: body.startTime!,
    endTime: body.endTime ?? body.startTime!,
    ideaIds: body.ideaIds ?? [],
    agenda: body.agenda ?? [],
    notes: body.notes?.slice(0, 280),
  });
  return NextResponse.json(plan, { status: 201 });
}
