import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Car, Clock, CloudSun, MapPin, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Polaroid } from "@/components/ui/Polaroid";
import { PillLink } from "@/components/ui/Pill";
import { Checklist } from "@/components/plans/Checklist";
import { WeatherLine } from "@/components/plans/WeatherLine";
import { getDate, getDates, today } from "@/lib/repository";
import { getWeatherFor } from "@/lib/weather";
import { clock, daysBetween, longDate, peso, shortDate, weekday, weekdayShort } from "@/lib/utils/format";
import type { PlannedDate } from "@/types";

type Props = { params: Promise<{ id: string }> };

const LINKS: [keyof PlannedDate["links"], string][] = [
  ["directions", "Directions"],
  ["reservation", "Reservation"],
  ["website", "Website"],
  ["instagram", "Instagram"],
  ["reviews", "Reviews"],
];

export async function generateStaticParams() {
  return (await getDates()).map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const date = await getDate((await params).id);
  return { title: date?.title ?? "Plan" };
}

const card = "rounded-card bg-card ring-1 ring-line";

export default async function PlanPage({ params }: Props) {
  const date = await getDate((await params).id);
  if (!date) notFound();
  const weather = await getWeatherFor(date.date, date.location.lat, date.location.lng);
  const until = daysBetween(today(), date.date);
  const links = LINKS.filter(([k]) => date.links[k]);

  const props: { Icon: typeof Clock; label: string; value: React.ReactNode }[] = [
    {
      Icon: CalendarDays,
      label: "Date",
      value: (
        <span className="flex flex-wrap items-center gap-2">
          {weekday(date.date)}, {longDate(date.date)}
          {until >= 0 && <span className="rounded-full bg-lime px-2 py-0.5 text-onlime text-[0.75rem] font-medium">{until === 0 ? "Today" : until === 1 ? "Tomorrow" : `In ${until} days`}</span>}
        </span>
      ),
    },
    { Icon: Clock, label: "Time", value: `${clock(date.startTime)} – ${clock(date.endTime)}` },
    { Icon: MapPin, label: "Place", value: `${date.location.name}, ${date.location.area}` },
    { Icon: CloudSun, label: "Weather", value: <WeatherLine weather={weather} /> },
    ...(date.budget ? [{ Icon: Wallet, label: "Budget", value: peso(date.budget) }] : []),
    ...(date.transportation ? [{ Icon: Car, label: "Getting there", value: date.transportation }] : []),
  ];

  return (
    <article className="pb-20">
      <PageHeader title={date.title} back={{ href: "/", label: "Plans" }} who="lark" />

      <div className="content mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[1fr_17rem] lg:gap-16">
        <div className="min-w-0">
          {/* Notion-style properties */}
          <dl className="divide-y divide-line border-y border-line">
            {props.map(({ Icon, label, value }) => (
              <div key={label} className="grid grid-cols-[8.5rem_1fr] items-center gap-3 py-2.5 text-[0.9375rem] sm:grid-cols-[10rem_1fr]">
                <dt className="flex items-center gap-2 text-label text-muted">
                  <Icon size={15} strokeWidth={1.8} aria-hidden /> {label}
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {links.map(([k, label]) => (
                <a key={k} href={date.links[k]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-card px-3.5 py-1.5 text-label font-medium ring-1 ring-line transition-colors hover:bg-sage">
                  {label} <ArrowUpRight size={14} className="text-muted" aria-hidden />
                </a>
              ))}
            </div>
          )}

          {date.agenda.length > 0 && (
            <section aria-labelledby="agenda" className="mt-12">
              <h2 id="agenda" className="font-serif text-heading">The plan</h2>
              <ol className="relative mt-4 space-y-5 border-l border-line pl-6">
                {date.agenda.map((a, i) => (
                  <li key={`${a.time}-${i}`} className="relative">
                    <span aria-hidden className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-page" />
                    <time className="font-type text-[0.8125rem] text-coral">{clock(a.time)}</time>
                    <p>{a.label}</p>
                    {a.note && <p className="text-label text-muted">{a.note}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {date.reminders.length > 0 && (
            <section aria-labelledby="remember" className="mt-12">
              <h2 id="remember" className="font-serif text-heading">Don&apos;t forget</h2>
              <div className={`${card} mt-4`}>
                <Checklist initial={date.reminders} />
              </div>
            </section>
          )}

          {/* phones: afterwards comes last */}
          <div className="mt-12 rounded-card bg-sage p-5 text-center lg:hidden">
            <p className="font-serif text-[1.25rem] italic">Afterwards</p>
            <p className="mt-1 text-label text-muted">Rate it and keep your favorite part.</p>
            <PillLink href={`/memories?from=${date.id}`} className="mt-4">
              Save as a memory
            </PillLink>
          </div>
        </div>

        {/* the print, a note, and what to do afterwards */}
        <aside className="order-first lg:order-none">
          <div className="mx-auto max-w-[17rem] px-4 lg:sticky lg:top-10 lg:px-0">
            <Polaroid scene={date.scene} src={date.image} alt={date.location.name} caption={date.location.name.toLowerCase()} tilt={-2.5} tape note={`${weekdayShort(date.date)} · ${shortDate(date.date)} ♡`.toLowerCase()} priority sizes="17rem" />
            {date.notes && <p className="mt-12 font-type text-[0.9375rem] leading-relaxed">“{date.notes}”</p>}
            <div className="mt-8 hidden rounded-card bg-sage p-5 text-center lg:block">
              <p className="font-serif text-[1.25rem] italic">Afterwards</p>
              <p className="mt-1 text-label text-muted">Rate it and keep your favorite part.</p>
              <PillLink href={`/memories?from=${date.id}`} className="mt-4">
                Save as a memory
              </PillLink>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
