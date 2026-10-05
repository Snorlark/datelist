import { Cloud, CloudLightning, CloudRain, CloudSun, Sun } from "lucide-react";
import type { Weather } from "@/types";

const ICON = { sun: Sun, "cloud-sun": CloudSun, cloud: Cloud, rain: CloudRain, storm: CloudLightning };

/** "☁ 29° Partly cloudy" — weather as a small inline fact. */
export function WeatherLine({ weather }: { weather: Weather }) {
  const Icon = ICON[weather.icon];
  return (
    <span className="inline-flex items-center gap-1.5 text-label text-muted">
      <Icon size={15} strokeWidth={1.8} aria-hidden />
      {weather.tempC}° {weather.summary}
    </span>
  );
}
