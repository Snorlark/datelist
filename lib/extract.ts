import type { ExtractedLink } from "@/types";

/**
 * Link → idea extraction. Mocked: recognises the source from the URL and
 * returns believable details. Swap the body for a real unfurl / Places lookup
 * later; the shape (ExtractedLink) stays the same.
 */
const KNOWN: Array<{ match: RegExp; data: Omit<ExtractedLink, "url" | "source"> }> = [
  { match: /toyo/i, data: { title: "Toyo Eatery", area: "Makati", category: "food", cuisine: "Filipino", rating: 4.7, price: 3, scene: "dinner" } },
  { match: /pottery|clay|ceramic/i, data: { title: "Pottery class", area: "Makati", category: "activity", rating: 4.9, price: 2, scene: "pottery" } },
  { match: /cinema|movie|film|imdb|letterboxd/i, data: { title: "Cinema date", area: "Greenbelt", category: "movie", rating: 4.4, price: 1, scene: "cinema" } },
  { match: /beach|launion|la-union|surf/i, data: { title: "La Union", area: "San Juan", category: "trip", rating: 4.8, price: 2, scene: "beach" } },
];

const FALLBACKS: Omit<ExtractedLink, "url" | "source">[] = [
  { title: "Hanami Kissaten", area: "BGC", category: "cafe", cuisine: "Japanese café", rating: 4.6, price: 2, scene: "cafe" },
  { title: "Gallery & garden", area: "Antipolo", category: "place", rating: 4.5, price: 1, scene: "park" },
  { title: "Night market", area: "Poblacion", category: "event", rating: 4.3, price: 1, scene: "market" },
];

export function detectSource(url: string): ExtractedLink["source"] {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/maps\.(google|app)|goo\.gl\/maps|maps\.app\.goo/.test(url)) return "maps";
  return "website";
}

export function extractLink(url: string): ExtractedLink {
  const source = detectSource(url);
  const known = KNOWN.find((k) => k.match.test(url));
  const data = known?.data ?? FALLBACKS[url.length % FALLBACKS.length];
  return { url, source, ...data };
}
