import fs from 'fs/promises';
import path from 'path';
import type { NewsItem } from './models';
import { localNews, regionalNews, nationalNews, govNews } from '@/data/news';

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
