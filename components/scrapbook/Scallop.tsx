import { cn } from "@/lib/utils/format";

// one bump, as a mask: the fill and outline take their colour from the theme
const BUMP = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='14' viewBox='0 0 28 14'><path d='M0 14 A14 14 0 0 1 28 14 Z'/></svg>")}")`;
const RIM = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='14' viewBox='0 0 28 14'><path d='M0.6 14 A13.4 13.4 0 0 1 27.4 14' fill='none' stroke='black' stroke-width='1.2'/></svg>")}")`;

const mask = (url: string): React.CSSProperties => ({
  maskImage: url,
  WebkitMaskImage: url,
  maskRepeat: "repeat-x",
  WebkitMaskRepeat: "repeat-x",
  maskSize: "28px 14px",
  WebkitMaskSize: "28px 14px",
});

/**
 * The wavy edge from the cat site: a row of half-circles in the theme's band
 * colour with an ink outline. `flip` points the bumps downward.
 */
export function Scallop({ flip, className }: { flip?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-[14px] w-full", flip && "rotate-180", className)}>
      <div className="absolute inset-0 bg-matcha" style={mask(BUMP)} />
      <div className="absolute inset-0 bg-ink" style={mask(RIM)} />
    </div>
  );
}
