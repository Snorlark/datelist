import "server-only";
import type { ISODate, Weather } from "@/types";

const codeToWeather = (code: number): Pick<Weather, "summary" | "icon"> => {
  if (code === 0) return { summary: "Clear", icon: "sun" };
  if (code <= 2) return { summary: "Partly cloudy", icon: "cloud-sun" };
  if (code <= 48) return { summary: "Cloudy", icon: "cloud" };
  if (code <= 82) return { summary: "Rain", icon: "rain" };
  return { summary: "Thunderstorms", icon: "storm" };
};

const noteFor = (w: Pick<Weather, "icon">) =>
  w.icon === "rain" || w.icon === "storm"
    ? "Bring the umbrella. Maybe the indoor plan."
    : "Looks like a good day for your date.";

const fallback: Weather = { tempC: 29, summary: "Partly cloudy", icon: "cloud-sun", note: "Looks like a good day for your date." };

/**
 * Contextual weather for one date. Open-Meteo needs no key and only forecasts
 * ~16 days out, so anything further returns a gentle default.
 */
export async function getWeatherFor(day: ISODate, lat: number, lng: number): Promise<Weather> {
  if (process.env.WEATHER_PROVIDER !== "open-meteo") return fallback;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max&timezone=Asia%2FManila&start_date=${day}&end_date=${day}`;
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 3 } });
    if (!res.ok) return fallback;
    const json = await res.json();
    const code = json?.daily?.weathercode?.[0];
    const temp = json?.daily?.temperature_2m_max?.[0];
    if (typeof code !== "number" || typeof temp !== "number") return fallback;
    const w = codeToWeather(code);
    return { tempC: Math.round(temp), ...w, note: noteFor(w) };
  } catch {
    return fallback;
  }
}
