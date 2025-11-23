#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

import type { EventItem } from '../../src/lib/models.js';
import { fetchText } from '../lib/http.js';

const OUTPUT_PATH = path.join(process.cwd(), 'data/generated/events.json');

interface EventSource {
  id: string;
  name: string;
  url: string;
}

const EVENT_SOURCES: EventSource[] = [
  {
    id: 'oneida-tourism',
    name: 'Oneida County Tourism Events',
    url: 'https://www.oneidacountytourism.com/events', // TODO: confirm real URL and add scraping logic
  },
  {
    id: 'utica-events',
    name: 'City of Utica Events',
    url: 'https://www.cityofutica.com/events-calendar', // TODO: confirm real URL and add scraping logic
  },
  {
    id: 'mvcc-calendar',
    name: 'MVCC Events Calendar',
    url: 'https://www.mvcc.edu/calendar', // TODO: confirm real URL and add scraping logic
  },
  {
    id: 'spectrum-sports-cny',
    name: 'Spectrum News 1 – Sports (Central NY)',
    url: 'https://spectrumlocalnews.com/services/contentfeed.nys%7Ccentral-ny%7Csports.landing.rss',
  },
  {
    id: 'oriskany-school-district',
    name: 'Oriskany School District',
    url: 'https://www.oriskanycsd.org/fs/calendar-manager/events.ics?calendar_ids[]=6&calendar_ids[]=3', 
  },
  {
    id: 'section-3-sports',
    name: 'Section 3 Sports',
    url: 'https://section3.org/services/responsive-calendar-subscription.ashx/calendar.rss?sport_id=0&amp;school_id=0&amp;schedule_id=57', 
  },
  {
    id: 'utica-pioneers',
    name: 'Utica University Pioneers',
    url: 'https://uticapioneers.com/rss.aspx?path=general', 
  },
  {
    id: 'utica-public-library',
    name: 'Utica Public Library',
    url: 'https://www.uticapubliclibrary.org/calendar/rss', 
  },
];

async function ingestEvents() {
  console.log('[ingest:events] Starting events ingestion...');
  
  const events: EventItem[] = [];

  for (const source of EVENT_SOURCES) {
    try {
      console.log(`[ingest:events] Fetching from ${source.name}: ${source.url}`);
      // TODO: Uncomment and implement scraping logic with cheerio
      // const html = await fetchText(source.url);
      // const $ = cheerio.load(html);
      // Parse HTML to extract event data:
      // - title, start, end (optional), location, organizer, sourceUrl, category
      // - Push to events array
      
      console.log(`[ingest:events] TODO: Add cheerio scraping logic for ${source.id}`);
    } catch (err) {
      console.error(`[ingest:events] Failed to process ${source.id}:`, err);
    }
  }

  // For now, generate sample data to demonstrate the structure
  console.log('[ingest:events] Using sample data (TODO: replace with real scraping)');
  const sampleEvents: EventItem[] = [
    {
      id: 'event-sample-1',
      title: 'Sample Community Festival',
      start: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      end: new Date(Date.now() + 86400000 * 3 + 14400000).toISOString(), // 4 hours later
      location: 'Downtown Utica',
      organizer: 'Utica Community Organization',
      sourceUrl: 'https://example.com/events/sample1',
      category: 'festival',
    },
    {
      id: 'event-sample-2',
      title: 'Sample Concert Series',
      start: new Date(Date.now() + 86400000 * 7).toISOString(), // 1 week from now
      location: 'Utica Auditorium',
      organizer: 'Utica Arts',
      sourceUrl: 'https://example.com/events/sample2',
      category: 'music',
    },
    {
      id: 'event-sample-3',
      title: 'Sample Sports Game',
      start: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      location: 'MVCC Athletics Complex',
      organizer: 'MVCC Athletics',
      sourceUrl: 'https://example.com/events/sample3',
      category: 'sports',
    },
  ];

  events.push(...sampleEvents);

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(events, null, 2), 'utf8');
  console.log('[ingest:events] Wrote', events.length, 'events to', OUTPUT_PATH);
}

ingestEvents().catch((err) => {
  console.error('[ingest:events] Error', err);
  process.exit(1);
});
