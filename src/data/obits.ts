export type Obit = {
  id: string;
  name: string;
  age?: number;
  city?: string;
  date: string; // ISO
  funeralHome?: string;
  sourceUrl: string;
};

export const obits: Obit[] = [
  {
    id: "o1",
    name: "Mary Johnson",
    age: 82,
    city: "Utica",
    date: "2025-11-20T00:00:00Z",
    funeralHome: "Eannace Funeral Home",
    sourceUrl: "https://www.legacy.com/us/obituaries/uticaod/name/mary-johnson-obituary?id=12345"
  },
  {
    id: "o2",
    name: "Robert Smith",
    age: 67,
    city: "Rome",
    date: "2025-11-19T00:00:00Z",
    funeralHome: "Matt Funeral Home",
    sourceUrl: "https://www.legacy.com/us/obituaries/romesentinel/name/robert-smith-obituary?id=23456"
  },
  {
    id: "o3",
    name: "John Doe",
    age: 91,
    city: "Oneida",
    date: "2025-11-18T00:00:00Z",
    funeralHome: "Campbell-Leach",
    sourceUrl: "https://www.uticaod.com/obituaries/john-doe"
  },
  {
    id: "o4",
    name: "Jane Brown",
    age: 74,
    city: "Utica",
    date: "2025-11-17T00:00:00Z",
    funeralHome: "Friedel Funeral Home",
    sourceUrl: "https://www.legacy.com/us/obituaries/name/jane-brown-obituary?id=34567"
  }
];
