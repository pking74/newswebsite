import type { NewsItem, Obit, PoliceCall, PoliceRelease, EventItem } from '../../src/lib/models';
import crypto from 'crypto';

export function generateIdFromUrl(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
}

export function normalizeTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ').replace(/[^\w\s-]/g, '');
}

export function generateTagsFromTitle(title: string): string[] {
  const tags = new Set<string>();
  const keywords = ['Utica', 'Rome', 'Oneida County', 'Police', 'School', 'Health', 'Road', 'Crime'];
  keywords.forEach((kw) => {
    if (title.toLowerCase().includes(kw.toLowerCase())) {
      tags.add(kw);
    }
  });
  return Array.from(tags);
}

export function dedupeByUrl<T extends { sourceUrl: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.sourceUrl)) {
      return false;
    }
    seen.add(item.sourceUrl);
    return true;
  });
}

export function sortByDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function rssItemToNewsItem(item: any, sourceName: string, category: NewsItem['category']): NewsItem {
  return {
    id: generateIdFromUrl(item.link || item.guid || ''),
    title: normalizeTitle(item.title || ''),
    sourceName,
    sourceUrl: item.link || item.guid || '',
    publishedAt: item.pubDate || new Date().toISOString(),
    category,
    tags: generateTagsFromTitle(item.title || ''),
  };
}
