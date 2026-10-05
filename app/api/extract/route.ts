import { NextResponse } from "next/server";
import { extractLink } from "@/lib/extract";

export async function POST(req: Request) {
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url || !/^https?:\/\/\S+\.\S+/.test(url.trim())) {
    return NextResponse.json({ error: "Paste a full link that starts with http." }, { status: 400 });
  }
  // a small pause so the "looking…" moment reads as intentional, not a flicker
  await new Promise((r) => setTimeout(r, 650));
  return NextResponse.json(extractLink(url.trim()));
}
