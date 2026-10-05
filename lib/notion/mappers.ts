import type { Category, DateIdea, Memory, NotionPage, PersonId, Scene } from "@/types";
import { read, write } from "./properties";

const sceneFor: Record<Category, Scene> = {
  food: "dinner", cafe: "cafe", trip: "beach", activity: "pottery",
  movie: "cinema", event: "market", place: "park",
};

export function pageToIdea(page: NotionPage): DateIdea {
  const p = page.properties as Record<string, Record<string, unknown>>;
  const category = (read.select(p.Category) ?? "place").toLowerCase() as Category;
  return {
    id: page.id,
    title: read.title(p.Name),
    description: read.text(p.Description),
    image: read.files(p.Image)[0],
    scene: (read.select(p.Scene) as Scene) ?? sceneFor[category] ?? "park",
    location: {
      name: read.title(p.Name),
      area: read.text(p.Area) ?? "",
      lat: read.number(p.Lat) ?? 14.5547,
      lng: read.number(p.Lng) ?? 121.0244,
    },
    category,
    cuisine: read.text(p.Cuisine),
    rating: read.number(p.Rating),
    price: read.number(p.Price) as DateIdea["price"],
    url: read.url(p.URL),
    source: read.select(p.Source)?.toLowerCase() as DateIdea["source"],
    notes: read.text(p.Notes),
    durationMinutes: read.number(p["Duration (min)"]) ?? 120,
    bestTime: (read.select(p["Best time"])?.toLowerCase() as DateIdea["bestTime"]) ?? "any",
    tags: read.multi(p.Tags).map((t) => t.toLowerCase()),
    savedBy: (read.select(p["Saved by"])?.toLowerCase() as PersonId) ?? "lark",
    savedAt: read.date(p["Saved at"]) ?? page.last_edited_time.slice(0, 10),
    status: (read.select(p.Status)?.toLowerCase() as DateIdea["status"]) ?? "saved",
    saying: read.text(p.Saying),
  };
}

export function ideaToProperties(idea: Omit<DateIdea, "id">) {
  return {
    Name: write.title(idea.title),
    Description: write.text(idea.description),
    Area: write.text(idea.location.area),
    Lat: write.number(idea.location.lat),
    Lng: write.number(idea.location.lng),
    Category: write.select(idea.category),
    Scene: write.select(idea.scene),
    Cuisine: write.text(idea.cuisine),
    Rating: write.number(idea.rating),
    Price: write.number(idea.price),
    URL: write.url(idea.url),
    Source: write.select(idea.source),
    Notes: write.text(idea.notes),
    "Duration (min)": write.number(idea.durationMinutes),
    "Best time": write.select(idea.bestTime),
    Tags: write.multi(idea.tags),
    "Saved by": write.select(idea.savedBy),
    "Saved at": write.date(idea.savedAt),
    Status: write.select(idea.status),
    Saying: write.text(idea.saying),
  };
}

export function pageToMemory(page: NotionPage): Memory {
  const p = page.properties as Record<string, Record<string, unknown>>;
  const photos = read.files(p.Photos);
  const scene = (read.select(p.Scene) as Scene) ?? "park";
  return {
    id: page.id,
    dateId: read.text(p["Date ID"]) ?? page.id,
    title: read.title(p.Name),
    date: read.date(p.Date) ?? page.last_edited_time.slice(0, 10),
    place: read.text(p.Place) ?? "",
    area: read.text(p.Area) ?? "",
    photos: photos.length ? photos.map((src) => ({ scene, src })) : [{ scene }],
    rating: (read.number(p.Rating) ?? 5) as Memory["rating"],
    favoriteMoment: read.text(p["Favorite moment"]) ?? "",
    notes: read.text(p.Notes),
    createdAt: page.last_edited_time.slice(0, 10),
  };
}
