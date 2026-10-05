import { Pet } from "@/components/illustrations/Pet";
import { Scallop } from "@/components/scrapbook/Scallop";

/**
 * First-open splash: Lark's dog and Sophia's cat, a heart balloon inflating between them,
 * the wordmark, then the whole sheet lifts away. Pure CSS, server-rendered so
 * it covers the very first paint. SPLASH_BOOT (in <head>) skips it for the rest
 * of the visit, and reduced motion skips it entirely.
 */
export function Splash() {
  return (
    <div id="splash" aria-hidden className="splash pointer-events-none fixed inset-0 z-[100]">
      <div className="flex h-full flex-col items-center justify-center bg-page">
        <div className="flex items-end gap-3">
          <Pet who="lark" size={84} priority />
          {/* the heart balloon on its string */}
          <svg viewBox="0 0 60 96" width="74" height="118" className="splash-balloon -mb-1" aria-hidden>
            <path d="M30 56c0 12-4 18 1 26s-2 12-1 14" fill="none" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" />
            <path
              d="M30 54C14 42 4 32 4 20 4 10 11 4 19 4c5 0 9 3 11 7 2-4 6-7 11-7 8 0 15 6 15 16 0 12-10 22-26 34z"
              fill="var(--color-balloon)"
              stroke="var(--color-ink)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M14 14c2-3 5-4 8-3" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
            <path d="M27 54l3 4 3-4z" fill="var(--color-balloon)" stroke="var(--color-ink)" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          <Pet who="sophia" size={84} priority />
        </div>
        <p className="splash-word balloon-text mt-7 text-[4rem] leading-none">datelist</p>
      </div>
      <Scallop flip className="-mt-px" />
    </div>
  );
}

/** Runs in <head>: show the splash once per visit, never with reduced motion. */
export const SPLASH_BOOT = `try{var s=sessionStorage;if(s.getItem("datelist-splash")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("splash-seen");else s.setItem("datelist-splash","1")}catch(e){}`;
