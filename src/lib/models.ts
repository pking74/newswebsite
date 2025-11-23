export type NewsItem = {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string; // ISO
  category: "local" | "regional" | "national" | "gov";
  tags?: string[];
  summary?: string; // short AI-generated or heuristic summary
};

export type Obit = {
  id: string;
  name: string;
  age?: number;
  city?: string;
  date: string; // ISO
  funeralHome?: string;
  sourceUrl: string;
};

export type PoliceCall = {
  id: string;
  timestamp: string; // ISO
  agency?: string;
  description: string;
  location?: string;
  sourceUrl?: string;
};

export type PoliceRelease = {
  id: string;
  title: string;
  publishedAt: string; // ISO
  summary: string;
  sourceUrl: string;
};

export type CameraLink = {
  id: string;
  title: string;
  location?: string;
  viewUrl: string;
  notes?: string;
};

export type SportsLink = {
  id: string;
  level: "High School" | "College" | "Pro";
  teamName: string;
  sport: string;
  scheduleUrl: string;
  notes?: string;
};

export type LinkCategory = {
  id: string;
  name: string;
  links: {
    id: string;
    label: string;
    url: string;
    description?: string;
  }[];
};

export type EventItem = {
  id: string;
  title: string;
  start: string; // ISO
  end?: string;
  location?: string;
  organizer?: string;
  sourceUrl: string;
  category?: "music" | "sports" | "festival" | "community" | "government";
};

export type WeatherSummary = {
  location: string;
  updatedAt: string;
  temperatureF: number;
  condition: string;
  icon?: string;
  shortForecast: string;
  todayHighF?: number;
  tonightLowF?: number;
};

export type WeatherAlert = {
  id: string;
  event: string;           // e.g. "Winter Storm Warning"
  headline?: string;
  description?: string;
  instruction?: string;
  severity?: string;
  urgency?: string;
  certainty?: string;
  effective?: string;      // ISO timestamps from NWS
  onset?: string;
  expires?: string;
  ends?: string;
  senderName?: string;
  areaDesc?: string;       // "Oneida; Madison; Herkimer" etc.
  sourceUrl?: string;
};

// ============================================================================
// Advertising
// ============================================================================

export type AdCategory =
  | "home"
  | "localNews"
  | "regionalNews"
  | "nationalNews"
  | "sports"
  | "weather"
  | "obits"
  | "police"
  | "events"
  | "links"
  | "generic";

export type AdPlacement =
  | "header"
  | "topOfPage"
  | "sidebar"
  | "inline"
  | "betweenBlocks"
  | "footer";

export type AdCreative = {
  id: string;
  advertiserName: string;
  // A short internal label (not necessarily shown to users)
  label?: string;

  // Either an image ad or HTML snippet (we'll start with image)
  imageUrl?: string;
  imageAlt?: string;
  targetUrl: string;

  // Text fallback (if image not used)
  headline?: string;
  bodyText?: string;

  categories: AdCategory[];  // where this ad is allowed to show (content category)
  placements: AdPlacement[]; // which slots on the page ("sidebar", "inline", etc.)

  weight?: number; // optional weighting for rotation
  active: boolean;

  startDate?: string; // ISO; if set, ad only runs on/after this date
  endDate?: string;   // ISO; if set, ad only runs before this date (exclusive)
};
