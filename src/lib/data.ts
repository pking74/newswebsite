import fs from 'fs/promises';
import path from 'path';
import type { NewsItem, Obit, PoliceCall, PoliceRelease, EventItem } from './models';
import { localNews, regionalNews, nationalNews, govNews } from '@/data/news';
import { obits as mockObits } from '@/data/obits';
import { policeCalls as mockPoliceCalls, policeReleases as mockPoliceReleases } from '@/data/police';
import { events as mockEvents } from '@/data/events';

type SummariesFile = {
  byId: Record<string, string>;
};

async function getSummariesMap(): Promise<Record<string, string>> {
  const summariesPath = path.join(process.cwd(), 'data/generated/summaries.json');
  try {
    const raw = await fs.readFile(summariesPath, 'utf-8');
    const data = JSON.parse(raw) as SummariesFile;
    return data.byId || {};
  } catch {
    console.warn('[data] No summaries.json found; proceeding without summaries.');
    return {};
  }
}

export async function getNewsItems(): Promise<{
  localNews: NewsItem[];
  regionalNews: NewsItem[];
  nationalNews: NewsItem[];
  govNews: NewsItem[];
}> {
  const generatedPath = path.join(process.cwd(), 'data/generated/news.json');
  
  let newsData: {
    localNews: NewsItem[];
    regionalNews: NewsItem[];
    nationalNews: NewsItem[];
    govNews: NewsItem[];
  };
  
  try {
    const data = await fs.readFile(generatedPath, 'utf-8');
    newsData = JSON.parse(data);
  } catch {
    console.warn('[data] Using mock news data (no generated/news.json)');
    newsData = {
      localNews,
      regionalNews,
      nationalNews,
      govNews,
    };
  }
  
  // Load and apply summaries
  const summariesMap = await getSummariesMap();
  
  function applySummaries(items: NewsItem[]): NewsItem[] {
    return items.map((item) => {
      const summary = summariesMap[item.id];
      return summary ? { ...item, summary } : item;
    });
  }
  
  return {
    localNews: applySummaries(newsData.localNews),
    regionalNews: applySummaries(newsData.regionalNews),
    nationalNews: applySummaries(newsData.nationalNews),
    govNews: applySummaries(newsData.govNews),
  };
}

export async function getObits(): Promise<Obit[]> {
  const generatedPath = path.join(process.cwd(), 'data/generated/obits.json');
  try {
    const data = await fs.readFile(generatedPath, 'utf-8');
    return JSON.parse(data) as Obit[];
  } catch {
    console.warn('[data] Using mock obits (no generated/obits.json)');
    return mockObits;
  }
}

export async function getPoliceData(): Promise<{ calls: PoliceCall[]; releases: PoliceRelease[] }> {
  const generatedPath = path.join(process.cwd(), 'data/generated/police.json');
  try {
    const data = await fs.readFile(generatedPath, 'utf-8');
    return JSON.parse(data) as { calls: PoliceCall[]; releases: PoliceRelease[] };
  } catch {
    console.warn('[data] Using mock police data (no generated/police.json)');
    return { calls: mockPoliceCalls, releases: mockPoliceReleases };
  }
}

export async function getEvents(): Promise<EventItem[]> {
  const generatedPath = path.join(process.cwd(), 'data/generated/events.json');
  try {
    const data = await fs.readFile(generatedPath, 'utf-8');
    return JSON.parse(data) as EventItem[];
  } catch {
    console.warn('[data] Using mock events (no generated/events.json)');
    return mockEvents;
  }
}
