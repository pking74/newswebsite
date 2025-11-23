import fs from 'fs/promises';
import path from 'path';
import type { NewsItem, Obit, PoliceCall, PoliceRelease, EventItem } from './models';
import { localNews, regionalNews, nationalNews, govNews } from '@/data/news';
import { obits as mockObits } from '@/data/obits';
import { policeCalls as mockPoliceCalls, policeReleases as mockPoliceReleases } from '@/data/police';
import { events as mockEvents } from '@/data/events';

export async function getNewsItems(): Promise<{
  localNews: NewsItem[];
  regionalNews: NewsItem[];
  nationalNews: NewsItem[];
  govNews: NewsItem[];
}> {
  const generatedPath = path.join(process.cwd(), 'data/generated/news.json');
  try {
    const data = await fs.readFile(generatedPath, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed;
  } catch {
    console.warn('[data] Using mock news data (no generated/news.json)');
    return {
      localNews,
      regionalNews,
      nationalNews,
      govNews,
    };
  }
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
