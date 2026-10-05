// SOMEDAY — domain model.
// Times are stored as local wall-clock strings ("YYYY-MM-DD", "HH:MM") in the
// couple's home timezone. That keeps server and client renders identical and
// avoids timezone drift for something as human as "Saturday at 6:30".

export type PersonId = "lark" | "sophia";
export type ISODate = string; // "2026-10-17"
export type ClockTime = string; // "18:30"

export interface User {
  id: PersonId;
  name: string;
  /** coat colour used for their little cat */
  coat: string;
  accent: string;
}

export interface Couple {
  id: string;
  members: [User, User];
  homeCity: string;
  timezone: string;
  since: ISODate;
}

export interface Location {
  name: string;
  area: string; // "Makati"
  address?: string;
  lat: number;
  lng: number;
}

export type Category =
  | "food"
  | "cafe"
  | "trip"
  | "activity"
  | "movie"
  | "event"
  | "place";

export type IdeaStatus = "saved" | "planned" | "done";

/** Which illustrated plate to draw when there's no photo yet. */
export type Scene =
  | "dinner"
  | "beach"
  | "pottery"
  | "cinema"
  | "cafe"
  | "sunset"
  | "market"
  | "park";

export interface DateIdea {
  id: string;
  title: string;
  description?: string;
  image?: string;
  scene: Scene;
  location: Location;
  category: Category;
  cuisine?: string;
  rating?: number;
  price?: 1 | 2 | 3 | 4;
  url?: string;
  source?: "instagram" | "tiktok" | "maps" | "website" | "friend";
  notes?: string;
  /** how long it usually takes, used to fit ideas into free windows */
  durationMinutes: number;
  /** best part of day for it */
  bestTime?: "morning" | "afternoon" | "evening" | "any";
  tags: string[];
  savedBy: PersonId;
  savedAt: ISODate;
  status: IdeaStatus;
  /** what one of them said when saving it — "We should..." */
  saying?: string;
}

export interface AgendaItem {
  time: ClockTime;
  label: string;
  note?: string;
}

export interface Reminder {
  id: string;
  label: string;
  done: boolean;
  secret?: boolean;
}

export interface Attachment {
  id: string;
  label: string;
  kind: "ticket" | "reservation" | "link" | "file";
  url?: string;
}

export interface DateLinks {
  website?: string;
  instagram?: string;
  directions?: string;
  reviews?: string;
  reservation?: string;
}

export type DateStatus = "planned" | "done" | "cancelled";

export interface PlannedDate {
  id: string;
  title: string;
  ideaIds: string[];
  date: ISODate;
  startTime: ClockTime;
  endTime: ClockTime;
  location: Location;
  agenda: AgendaItem[];
  notes?: string;
  links: DateLinks;
  reservationUrl?: string;
  budget?: number;
  transportation?: string;
  attachments: Attachment[];
  reminders: Reminder[];
  status: DateStatus;
  scene: Scene;
  image?: string;
}

export interface Memory {
  id: string;
  dateId: string;
  title: string;
  date: ISODate;
  place: string;
  area: string;
  photos: { scene: Scene; src?: string; caption?: string }[];
  rating: 1 | 2 | 3 | 4 | 5;
  favoriteMoment: string;
  notes?: string;
  createdAt: ISODate;
}

export interface Preference {
  label: string;
  who: PersonId | "both";
  sentiment: "love" | "nope";
  /** tags this preference boosts or suppresses in recommendations */
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  owner: PersonId;
  title: string;
  day: ISODate;
  start: ClockTime;
  end: ClockTime;
  /** private events show only as "busy" to the other person */
  private?: boolean;
}

export interface CalendarConnection {
  owner: PersonId;
  provider: "google" | "apple" | "outlook" | "mock";
  connected: boolean;
  lastSyncedAt?: string;
}

export interface FreeWindow {
  day: ISODate;
  start: ClockTime;
  end: ClockTime;
  minutes: number;
}

export interface Suggestion {
  window: FreeWindow;
  ideas: DateIdea[];
  minutes: number;
  reason: string;
}

export interface Place {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  kind: "visited" | "want" | "favorite";
}

export interface Weather {
  tempC: number;
  summary: string;
  icon: "sun" | "cloud-sun" | "cloud" | "rain" | "storm";
  note: string;
}

/** Shape returned from link extraction (mocked today, real scraper later). */
export interface ExtractedLink {
  url: string;
  title: string;
  area: string;
  category: Category;
  cuisine?: string;
  rating?: number;
  price?: 1 | 2 | 3 | 4;
  source: NonNullable<DateIdea["source"]>;
  scene: Scene;
}

/** Minimal shape of a Notion page we rely on (keeps the SDK out of components). */
export interface NotionPage {
  id: string;
  url: string;
  properties: Record<string, unknown>;
  last_edited_time: string;
}
