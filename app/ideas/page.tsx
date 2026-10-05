import type { Metadata } from "next";
import { IdeasBoard } from "@/components/ideas/IdeasBoard";
import { getIdeas } from "@/lib/repository";

export const metadata: Metadata = { title: "Ideas" };
export const dynamic = "force-dynamic";

export default async function IdeasPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  const [{ open }, ideas] = await Promise.all([searchParams, getIdeas()]);
  return <IdeasBoard ideas={ideas.filter((i) => i.status !== "done")} openId={open} />;
}
