import { NextResponse } from "next/server";
import type { DateIdea, ExtractedLink, PersonId } from "@/types";
import { getIdeas, saveIdea, today } from "@/lib/repository";

const DURATION: Record<DateIdea["category"], number> = {
  food: 90, cafe: 75, trip: 480, activity: 120, movie: 150, event: 90, place: 60,
};

export async function GET() {
  return NextResponse.json(await getIdeas());
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { link: ExtractedLink; savedBy: PersonId; notes?: string }
    | null;
  if (!body?.link?.title) return NextResponse.json({ error: "Nothing to save yet." }, { status: 400 });

  const { link } = body;
  const idea = await saveIdea({
    title: link.title,
    scene: link.scene,
    location: { name: link.title, area: link.area, lat: 14.5547, lng: 121.0244 },
    category: link.category,
    cuisine: link.cuisine,
    rating: link.rating,
    price: link.price,
    url: link.url,
    source: link.source,
    notes: body.notes,
    durationMinutes: DURATION[link.category],
    bestTime: "any",
    tags: [link.category, ...(link.cuisine ? [link.cuisine.toLowerCase()] : [])],
    savedBy: body.savedBy,
    savedAt: today(),
    status: "saved",
  });
  return NextResponse.json(idea, { status: 201 });
}
