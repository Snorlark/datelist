import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { PersonId } from "@/types";
import { PageCover } from "@/components/shell/PageCover";

/** Notion-style page top: cover band, then back link, big serif title and one action. */
export function PageHeader({
  title,
  sub,
  back,
  action,
  who,
}: {
  title: string;
  sub?: string;
  back?: { href: string; label: string };
  action?: React.ReactNode;
  who?: PersonId;
}) {
  return (
    <>
      <PageCover crumb={back ? `${back.label} / ${title}` : title} who={who} />
      <header className="content pt-10 lg:pt-12">
        {back && (
          <Link href={back.href} className="-ml-1.5 inline-flex items-center gap-0.5 text-label font-medium text-muted hover:text-ink">
            <ChevronLeft size={18} strokeWidth={2} aria-hidden />
            {back.label}
          </Link>
        )}
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-[2.5rem] leading-[1.05] tracking-[-0.01em] lg:text-[3.25rem]">{title}</h1>
            {sub && <p className="mt-2 text-muted">{sub}</p>}
          </div>
          {action}
        </div>
      </header>
    </>
  );
}
