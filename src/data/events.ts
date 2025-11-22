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

export const events: EventItem[] = [
  {
    id: "e1",
    title: "Utica Saturday Night Market",
    start: "2025-11-22T10:00:00Z",
    end: "2025-11-22T14:00:00Z",
    location: "Utica Harbor Lock",
    organizer: "Utica Proud",
    sourceUrl: "https://uticaproud.com/events/saturday-market",
    category: "community"
  },
  {
    id: "e2",
    title: "Rome Holiday Parade",
    start: "2025-11-23T18:00:00Z",
    location: "Downtown Rome",
    organizer: "Rome Chamber of Commerce",
    sourceUrl: "https://romenchamber.com/parade-2025",
    category: "festival"
  },
  {
    id: "e3",
    title: "MVCC Hawks Basketball Game",
    start: "2025-11-24T19:00:00Z",
    location: "MVCC Gym",
    organizer: "MVCC Athletics",
    sourceUrl: "https://mvccathletics.com/calendar",
    category: "sports"
  },
  {
    id: "e4",
    title: "Oneida County Board Meeting",
    start: "2025-11-25T18:30:00Z",
    location: "Utica Courthouse",
    organizer: "Oneida County Legislature",
    sourceUrl: "https://oneidacountyny.gov/legislature/meetings",
    category: "government"
  },
  {
    id: "e5",
    title: "Utica Symphony Concert",
    start: "2025-11-26T20:00:00Z",
    location: "Utica Masonic Temple",
    organizer: "Utica Symphony",
    sourceUrl: "https://uticasymphony.org/concerts",
    category: "music"
  },
  {
    id: "e6",
    title: "Rome Community Clean-Up Day",
    start: "2025-11-27T09:00:00Z",
    end: "2025-11-27T12:00:00Z",
    location: "Fish Creek",
    organizer: "Rome Green Committee",
    sourceUrl: "https://romegreen.org/cleanup",
    category: "community"
  }
];
