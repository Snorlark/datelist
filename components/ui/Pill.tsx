import Link from "next/link";
import { cn } from "@/lib/utils/format";

/** The one primary button: a black pill, like "Attend a session". */
export const pill =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-label font-medium text-page transition-transform active:scale-[0.97] disabled:opacity-40";

/** Quiet secondary button on a sage fill. */
export const softPill =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-sage px-4 py-2 text-label font-medium text-ink transition-colors hover:bg-line active:scale-[0.97]";

export function PillLink({ href, children, soft, className }: { href: string; children: React.ReactNode; soft?: boolean; className?: string }) {
  return (
    <Link href={href} className={cn(soft ? softPill : pill, className)}>
      {children}
    </Link>
  );
}
