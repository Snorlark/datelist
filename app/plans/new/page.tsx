import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlanForm } from "@/components/plans/PlanForm";
import { getIdeas, today } from "@/lib/repository";

export const metadata: Metadata = { title: "Plan a date" };

export default async function NewPlanPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const ideas = (await getIdeas()).filter((i) => i.status !== "done");
  const day = /^\d{4}-\d{2}-\d{2}$/.test(sp.day ?? "") ? sp.day : undefined;
  const start = /^\d{2}:\d{2}$/.test(sp.start ?? "") ? sp.start : undefined;
  const ideaIds = (sp.idea ?? "").split(",").filter(Boolean);

  return (
    <>
      <PageHeader title="Plan a date" back={{ href: "/", label: "Plans" }} />
      <PlanForm key={`${ideaIds.join()}-${day}-${start}`} ideas={ideas} prefill={{ ideaIds, day, start }} today={today()} />
    </>
  );
}
