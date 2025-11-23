#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

import { parseRssFeed } from '../lib/rss.js';
import type { NewsItem } from '../../src/lib/models.js';
import { rssItemToNewsItem, dedupeByUrl, sortByDateDesc } from '../lib/normalize.js';

const OUTPUT_PATH = path.join(process.cwd(), 'data/generated/news.json');

type Category = 'local' | 'regional' | 'national' | 'gov';

interface NewsSource {
  id: string;
  name: string;
  category: Category;
  feedUrl: string;
}

const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'utica-od',
    name: 'Utica Observer-Dispatch',
    category: 'local',
    feedUrl: 'https://www.uticaod.com/section/feed', 
  },
  {
    id: 'rome-sentinel',
    name: 'Rome Sentinel',
    category: 'local',
    feedUrl: 'https://romesentinel.com/feed/', // TODO: confirm real RSS URL
  },
  {
    id: 'times-telegram',
    name: 'Times Telegram',
    category: 'local',
    feedUrl: 'https://www.timestelegram.com/section/feed', 
  },
  {
    id: 'spectrum-news-cny',
    name: 'Spectrum News 1 – Central NY',
    category: 'local',
    feedUrl: 'https://spectrumlocalnews.com/services/contentfeed.nys%7Ccentral-ny%7Cnews.landing.rss', 
  },
  {
    id: 'wktv',
    name: 'WKTV',
    category: 'local',
    feedUrl: 'https://www.wktv.com/_rss/', // TODO: confirm real RSS URL
  },
  {
    id: 'npr',
    name: 'NPR',
    category: 'national',
    feedUrl: 'https://feeds.npr.org/1001/rss.xml',
  },
  {
    id: 'whitehouse',
    name: 'White House',
    category: 'gov',
    feedUrl: 'https://www.whitehouse.gov/news-briefings/feed/',
  },
];

async function ingestNews() {
  console.log('[ingest:news] Starting ingestion from RSS feeds...');

  const buckets: {
    localNews: NewsItem[];
    regionalNews: NewsItem[];
    nationalNews: NewsItem[];
    govNews: NewsItem[];
  } = {
    localNews: [],
    regionalNews: [],
    nationalNews: [],
    govNews: [],
  };

  for (const source of NEWS_SOURCES) {
    try {
      console.log(`[ingest:news] Fetching ${source.name} (${source.category}) from ${source.feedUrl}`);
      const items = await parseRssFeed(source.feedUrl);
      const newsItems = items.map((item) => rssItemToNewsItem(item, source.name, source.category));
      const bucketKey = `${source.category}News` as keyof typeof buckets;
      buckets[bucketKey]!.push(...newsItems);
      console.log(`[ingest:news] Added ${newsItems.length} items from ${source.name}`);
    } catch (err) {
      console.error(`[ingest:news] Failed to process ${source.id}:`, err);
    }
  }

  // Dedupe and sort each bucket
  (Object.keys(buckets) as (keyof typeof buckets)[]).forEach((key) => {
    buckets[key] = sortByDateDesc(dedupeByUrl(buckets[key]));
  });

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(buckets, null, 2), 'utf8');
  console.log('[ingest:news] Wrote categorized news to', OUTPUT_PATH);
  console.log('[ingest:news] Summary:', {
    localNews: buckets.localNews.length,
    regionalNews: buckets.regionalNews.length,
    nationalNews: buckets.nationalNews.length,
    govNews: buckets.govNews.length,
  });
}

ingestNews().catch((err) => {
  console.error('[ingest:news] Error', err);
  process.exit(1);
});
