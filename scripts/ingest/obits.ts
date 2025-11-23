#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

import type { Obit } from '../../src/lib/models.js';
import { fetchText } from '../lib/http.js';

const OUTPUT_PATH = path.join(process.cwd(), 'data/generated/obits.json');

interface ObitSource {
  id: string;
  name: string;
  url: string;
}

const OBIT_SOURCES: ObitSource[] = [
  {
    id: 'legacy-utica',
    name: 'Legacy.com - Utica Observer-Dispatch',
    url: 'https://www.legacy.com/us/obituaries/uticaod/', // TODO: confirm real URL and add scraping logic
  },
  {
    id: 'od-obits',
    name: 'Observer-Dispatch Obituaries',
    url: 'https://www.uticaod.com/obituaries/', // TODO: confirm real URL and add scraping logic
  },
];

async function ingestObits() {
  console.log('[ingest:obits] Starting obituary ingestion...');
  
  const obits: Obit[] = [];

  for (const source of OBIT_SOURCES) {
    try {
      console.log(`[ingest:obits] Fetching from ${source.name}: ${source.url}`);
      // TODO: Uncomment and implement scraping logic with cheerio
      // const html = await fetchText(source.url);
      // const $ = cheerio.load(html);
      // Parse HTML to extract obituary data:
      // - Name, age, city, date, funeral home, sourceUrl
      // - Push to obits array
      
      console.log(`[ingest:obits] TODO: Add cheerio scraping logic for ${source.id}`);
    } catch (err) {
      console.error(`[ingest:obits] Failed to process ${source.id}:`, err);
    }
  }

  // For now, generate sample data to demonstrate the structure
  console.log('[ingest:obits] Using sample data (TODO: replace with real scraping)');
  const sampleObits: Obit[] = [
    {
      id: 'sample-1',
      name: 'Sample Person One',
      age: 85,
      city: 'Utica',
      date: new Date().toISOString(),
      funeralHome: 'Sample Funeral Home',
      sourceUrl: 'https://example.com/obit/sample1',
    },
    {
      id: 'sample-2',
      name: 'Sample Person Two',
      age: 72,
      city: 'Rome',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      funeralHome: 'Another Funeral Home',
      sourceUrl: 'https://example.com/obit/sample2',
    },
  ];

  obits.push(...sampleObits);

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(obits, null, 2), 'utf8');
  console.log('[ingest:obits] Wrote', obits.length, 'obituaries to', OUTPUT_PATH);
}

ingestObits().catch((err) => {
  console.error('[ingest:obits] Error', err);
  process.exit(1);
});
