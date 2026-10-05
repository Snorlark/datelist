import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { MemoryCard } from "@/components/memories/MemoryCard";
import { HowWasIt } from "@/components/memories/HowWasIt";
import { getDate, getMemories } from "@/lib/repository";
import { cn, monthName, year } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Memories" };
export const dynamic = "force-dynamic";

export default async function MemoriesPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  const [memories, date] = await Promise.all([getMemories(), from ? getDate(from) : undefined]);

  return (
    <>
      <PageHeader title="Memories" sub={`${memories.length} dates you actually went on, kept like a scrapbook.`} who="lark" />

      {date && (
        <section aria-labelledby="hww" className="content mt-10">
          <div className="max-w-xl rounded-card bg-sage p-6">
            <h2 id="hww" className="font-serif text-heading">
              How was {date.title}?
            </h2>
            <HowWasIt date={date} />
          </div>
        </section>
      )}

      <ul className="content mt-14 grid grid-cols-2 gap-x-6 gap-y-14 pb-20 md:grid-cols-3 xl:grid-cols-4">
        {memories.map((m, i) => {
          const month = `${monthName(m.date)} ${year(m.date)}`;
          const firstOfMonth = i === 0 || m.date.slice(0, 7) !== memories[i - 1].date.slice(0, 7);
          return (
            <li key={m.id}>
              {/* a coral stamp marks where each month starts */}
              <p className={cn("mb-4 inline-block -rotate-2 bg-coral/10 px-2 py-0.5 font-type text-[0.8125rem] text-coral", !firstOfMonth && "invisible")} aria-hidden={!firstOfMonth}>
                {month.toLowerCase()}
              </p>
              <MemoryCard memory={m} tilt={i % 2 ? 1.8 : -1.8} tape={i % 2 === 0} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
