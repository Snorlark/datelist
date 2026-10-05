import Image from "next/image";
import type { Scene } from "@/types";
import { cn } from "@/lib/utils/format";

/**
 * A "photograph". Real photos (from Notion or uploads) render through
 * next/image; until then each scene is a quiet painted plate in the house
 * palette, so the layout never shows a grey placeholder box.
 */
export function PhotoPlate({
  scene,
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 30vw, 80vw",
  priority,
}: {
  scene: Scene;
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-sage", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={alt}>
          {SCENES[scene]}
          <rect width="400" height="500" filter="url(#plate-grain)" opacity="0.5" />
        </svg>
      )}
    </div>
  );
}

/** Global filter defs, rendered once in the root layout. */
export function PlateDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <filter id="plate-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.17  0 0 0 0.22 0" />
        </filter>
      </defs>
    </svg>
  );
}

const INK = "#40352C";

const SCENES: Record<Scene, React.ReactNode> = {
  dinner: (
    <>
      <rect width="400" height="500" fill="#E9DCC6" />
      <rect y="0" width="400" height="190" fill="#8B654D" />
      <path d="M130 0v70M270 0v70" stroke={INK} strokeWidth="2" />
      <path d="M100 70h60l-12 34h-36zM240 70h60l-12 34h-36z" fill="#F5C83A" />
      <ellipse cx="200" cy="400" rx="260" ry="190" fill="#E97B67" />
      <ellipse cx="140" cy="360" rx="70" ry="30" fill="#FCFAF4" />
      <ellipse cx="140" cy="355" rx="40" ry="15" fill="#F5C83A" />
      <ellipse cx="270" cy="420" rx="76" ry="32" fill="#FCFAF4" />
      <ellipse cx="262" cy="414" rx="30" ry="12" fill="#A8C979" />
      <ellipse cx="285" cy="418" rx="18" ry="8" fill="#8B654D" />
      <path d="M210 300l80 40M216 296l80 40" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M318 250h22v54h-22z" fill="#FCFAF4" opacity="0.8" />
      <ellipse cx="329" cy="304" rx="16" ry="5" fill="#FCFAF4" />
    </>
  ),
  beach: (
    <>
      <rect width="400" height="500" fill="#FFF5CC" />
      <circle cx="290" cy="150" r="46" fill="#F5C83A" />
      <rect y="250" width="400" height="80" fill="#9FBFB5" />
      <path d="M0 270c40-8 80 8 120 0s80-8 120 0 80 8 160 0" stroke="#FCFAF4" strokeWidth="3" fill="none" />
      <path d="M0 300c50-6 90 6 140 0s90-6 140 0 70 6 120 0" stroke="#FCFAF4" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M0 330c80-20 200 14 400-6v176H0z" fill="#EAD9B5" />
      <path d="M90 470V360" stroke={INK} strokeWidth="3" />
      <path d="M30 372c30-30 90-30 120 0z" fill="#E97B67" />
      <path d="M60 372 90 342 120 372" stroke="#FCFAF4" strokeWidth="2" fill="none" />
      <rect x="230" y="410" width="110" height="42" rx="3" fill="#A8C979" transform="rotate(-8 285 431)" />
    </>
  ),
  pottery: (
    <>
      <rect width="400" height="500" fill="#C99A7C" />
      <rect y="0" width="400" height="230" fill="#8B654D" />
      <path d="M40 60h90v110H40zM160 50h70v70h-70z" fill="#E9DCC6" opacity="0.6" />
      <ellipse cx="200" cy="390" rx="160" ry="50" fill="#40352C" />
      <ellipse cx="200" cy="380" rx="140" ry="40" fill="#E9DCC6" />
      <path d="M150 380c-10-60 0-120 22-140h56c22 20 32 80 22 140z" fill="#D9A27F" stroke={INK} strokeWidth="2" />
      <ellipse cx="200" cy="240" rx="28" ry="7" fill="#B98163" stroke={INK} strokeWidth="2" />
      <path d="M168 300c20 6 44 6 64 0" stroke="#FCFAF4" strokeWidth="2" opacity="0.6" fill="none" />
      <path d="M70 330c20-20 50-24 70-10M330 330c-20-20-50-24-70-10" stroke="#E9DCC6" strokeWidth="18" strokeLinecap="round" fill="none" />
    </>
  ),
  cinema: (
    <>
      <rect width="400" height="500" fill="#40352C" />
      <rect x="40" y="70" width="320" height="170" fill="#FFF5CC" />
      <path d="M40 240 0 300V0h400v300l-40-60" fill="#2F2620" />
      <path d="M0 300h400v200H0z" fill="#33291F" />
      {[330, 380, 430, 480].map((y, i) => (
        <g key={y} fill="#8B654D">
          {Array.from({ length: 7 }).map((_, j) => (
            <path key={j} d={`M${j * 62 - (i % 2) * 30} ${y}a30 26 0 0 1 60 0v30h-60z`} />
          ))}
        </g>
      ))}
      <circle cx="170" cy="335" r="20" fill="#E97B67" />
      <circle cx="214" cy="335" r="20" fill="#F5C83A" />
      <path d="M90 120h140M90 150h90" stroke="#E9DCC6" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  cafe: (
    <>
      <rect width="400" height="500" fill="#E8F0D8" />
      <rect x="40" y="40" width="320" height="240" fill="#FCFAF4" stroke={INK} strokeWidth="3" />
      <path d="M200 40v240M40 160h320" stroke={INK} strokeWidth="3" />
      <circle cx="300" cy="100" r="26" fill="#F5C83A" opacity="0.8" />
      <rect y="300" width="400" height="200" fill="#C99A7C" />
      <path d="M150 360h70v54a26 26 0 0 1-26 26h-18a26 26 0 0 1-26-26z" fill="#FCFAF4" stroke={INK} strokeWidth="2.5" />
      <path d="M220 374c18 0 18 30 0 30" stroke={INK} strokeWidth="2.5" fill="none" />
      <ellipse cx="185" cy="362" rx="35" ry="7" fill="#8B654D" />
      <path d="M175 340c-6-12 6-16 0-28M195 340c-6-12 6-16 0-28" stroke={INK} strokeWidth="1.6" fill="none" opacity="0.6" />
      <ellipse cx="300" cy="440" rx="54" ry="14" fill="#FCFAF4" />
      <path d="M262 432c10-36 66-36 76 0z" fill="#A8C979" />
      <path d="M70 300c-4-30 6-60 20-80M84 300c10-20 30-36 50-40" stroke="#A8C979" strokeWidth="8" strokeLinecap="round" fill="none" />
    </>
  ),
  sunset: (
    <>
      <rect width="400" height="500" fill="#F7D9A8" />
      <rect y="0" width="400" height="120" fill="#F5C83A" opacity="0.5" />
      <circle cx="200" cy="290" r="90" fill="#E97B67" />
      <rect y="290" width="400" height="210" fill="#8B654D" />
      {[310, 330, 352, 378, 410].map((y, i) => (
        <path key={y} d={`M${130 - i * 12} ${y}h${140 + i * 24}`} stroke="#E97B67" strokeWidth="4" strokeLinecap="round" opacity={0.8 - i * 0.12} />
      ))}
      <path d="M330 500V250" stroke={INK} strokeWidth="5" />
      <path d="M330 252c-30-10-50 0-62 18M330 252c30-12 52-4 64 14M330 252c-12-24-30-32-50-30M330 252c10-26 30-34 50-28" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  ),
  market: (
    <>
      <rect width="400" height="500" fill="#FCFAF4" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={i * 50} y="40" width="50" height="90" fill={i % 2 ? "#FCFAF4" : "#A8C979"} />
      ))}
      <path d="M0 130q25 26 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" fill="#A8C979" />
      <rect y="300" width="400" height="200" fill="#8B654D" />
      <rect x="30" y="300" width="160" height="60" fill="#C99A7C" stroke={INK} strokeWidth="2" />
      <rect x="210" y="300" width="160" height="60" fill="#C99A7C" stroke={INK} strokeWidth="2" />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={52 + i * 24} cy={292} r="12" fill="#F5C83A" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={232 + i * 24} cy={292} r="12" fill="#E97B67" />
      ))}
      <path d="M110 200c0-20 30-20 30 0 0 30-30 30-30 0z" fill="#E97B67" opacity="0.4" />
    </>
  ),
  park: (
    <>
      <rect width="400" height="500" fill="#FFF5CC" />
      <path d="M0 260c80-60 160-60 240-20s120 20 160-10v270H0z" fill="#A8C979" />
      <path d="M0 330c100-40 220-30 400 10v160H0z" fill="#8FB262" />
      <path d="M180 500c10-60 40-110 60-170" stroke="#EAD9B5" strokeWidth="26" fill="none" strokeLinecap="round" />
      <path d="M90 330V250" stroke={INK} strokeWidth="5" />
      <circle cx="90" cy="230" r="44" fill="#6F9450" />
      <circle cx="300" cy="120" r="30" fill="#F5C83A" />
      <path d="M40 90h50M60 110h60" stroke="#FCFAF4" strokeWidth="8" strokeLinecap="round" />
    </>
  ),
};
