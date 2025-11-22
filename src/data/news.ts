import type { NewsItem } from '@/lib/models';

export const localNews: NewsItem[] = [
  { id: "1", title: "Utica Police Shooting Downtown", sourceName: "Utica OD", sourceUrl: "https://uticaod.com/1", publishedAt: "2025-11-20T14:30:00Z", category: "local", tags: ["Utica"] },
  { id: "2", title: "Rome School Budget Cuts", sourceName: "Rome Sentinel", sourceUrl: "https://romesentinel.com/2", publishedAt: "2025-11-20T12:00:00Z", category: "local", tags: ["Rome"] },
  { id: "3", title: "Oneida Flu Surge", sourceName: "WKTV", sourceUrl: "https://wktv.com/3", publishedAt: "2025-11-20T10:45:00Z", category: "local", tags: ["Health"] },
  { id: "4", title: "Utica Park Development", sourceName: "Spectrum CNY", sourceUrl: "https://spectrumcny.com/4", publishedAt: "2025-11-19T18:00:00Z", category: "local" },
  { id: "5", title: "Rome Burglary Arrest", sourceName: "Utica OD", sourceUrl: "https://uticaod.com/5", publishedAt: "2025-11-19T16:20:00Z", category: "local" },
  { id: "6", title: "County Road Closures", sourceName: "Oneida Gov", sourceUrl: "https://oneidagov.com/6", publishedAt: "2025-11-19T09:00:00Z", category: "local" }
];

export const regionalNews: NewsItem[] = [
  { id: "r1", title: "Syracuse Accident", sourceName: "Syracuse.com", sourceUrl: "https://syracuse.com/r1", publishedAt: "2025-11-20T15:00:00Z", category: "regional" },
  { id: "r2", title: "Central NY Alert", sourceName: "Spectrum News", sourceUrl: "https://spectrumnews.com/r2", publishedAt: "2025-11-20T11:30:00Z", category: "regional" },
  { id: "r3", title: "Albany Budget Debate", sourceName: "Times Union", sourceUrl: "https://timesunion.com/r3", publishedAt: "2025-11-19T20:00:00Z", category: "regional" },
  { id: "r4", title: "Rochester Protest", sourceName: "Dem Chronicle", sourceUrl: "https://democratandchronicle.com/r4", publishedAt: "2025-11-19T17:00:00Z", category: "regional" }
];

export const nationalNews: NewsItem[] = [
  { id: "n1", title: "Senate Infrastructure Bill", sourceName: "CNN", sourceUrl: "https://cnn.com/n1", publishedAt: "2025-11-20T13:00:00Z", category: "national" },
  { id: "n2", title: "Stock Market Record", sourceName: "Fox Business", sourceUrl: "https://foxbusiness.com/n2", publishedAt: "2025-11-20T10:00:00Z", category: "national" },
  { id: "n3", title: "FBI Cyber Warning", sourceName: "NBC News", sourceUrl: "https://nbcnews.com/n3", publishedAt: "2025-11-19T22:00:00Z", category: "national" }
];

export const govNews: NewsItem[] = [
  { id: "g1", title: "Hochul Flood Aid", sourceName: "NY Gov", sourceUrl: "https://governor.ny.gov/g1", publishedAt: "2025-11-20T16:00:00Z", category: "gov" },
  { id: "g2", title: "County Executive Update", sourceName: "Oneida County", sourceUrl: "https://oneidacountyny.gov/g2", publishedAt: "2025-11-19T14:00:00Z", category: "gov" },
  { id: "g3", title: "DMV License Changes", sourceName: "DMV NY", sourceUrl: "https://dmv.ny.gov/g3", publishedAt: "2025-11-18T11:00:00Z", category: "gov" }
];
