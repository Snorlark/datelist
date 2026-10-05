import type { Metadata } from "next";
import { PageCover } from "@/components/shell/PageCover";
import { Pet } from "@/components/illustrations/Pet";
import { PillLink } from "@/components/ui/Pill";

export const metadata: Metadata = { title: "Page not found" };

/** 404: a blank print — the photo never developed — and two sad pets. */
export default function NotFound() {
  return (
    <div className="pb-24">
      <PageCover crumb="Not found" who="lark" />
      <div className="content flex flex-col items-center pt-20 text-center lg:pt-24">
        <div className="relative w-56">
          <Pet who="sophia" mood="sad" size={64} className="absolute -top-[46px] left-1/2 z-10 -translate-x-1/2" />
          <Pet who="lark" mood="sad" size={58} className="absolute -bottom-6 -right-12 z-10 rotate-6" />
          <figure className="relative -rotate-3 bg-print p-2 pb-1 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_32px_-16px_rgb(0_0_0/0.3)]">
            <div className="grid aspect-[4/3] place-items-center bg-sage">
              <span className="font-serif text-[3.5rem] leading-none text-faint">404</span>
            </div>
            <figcaption className="px-0.5 py-2 text-left font-type text-[0.75rem] leading-none text-[#2b2b28]">page not found</figcaption>
            <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-[38%] -translate-x-1/2 rotate-2 bg-tape/75 mix-blend-multiply" />
          </figure>
        </div>
        <h1 className="mt-12 font-serif text-[2.25rem] leading-tight lg:text-[2.75rem]">This page wandered off.</h1>
        <p className="mt-3 max-w-sm text-muted">It may have moved, or the link has a typo. Everything else is right where you left it.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PillLink href="/">Back to plans</PillLink>
          <PillLink href="/ideas" soft className="py-3">
            Browse ideas
          </PillLink>
        </div>
      </div>
    </div>
  );
}
