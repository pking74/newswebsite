#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

import type { PoliceCall, PoliceRelease } from '../../src/lib/models.js';
import { fetchText } from '../lib/http.js';

const OUTPUT_PATH = path.join(process.cwd(), 'data/generated/police.json');

interface PoliceSource {
  id: string;
  name: string;
  type: 'calls' | 'releases';
  url: string;
}

const POLICE_SOURCES: PoliceSource[] = [
  {
    id: 'oneida-911',
    name: 'Oneida County 911 Call Log',
    type: 'calls',
    url: 'https://www.oneidacounty911.com/call-log', // TODO: confirm real URL and add scraping logic
  },
  {
    id: 'utica-pd-releases',
    name: 'Utica Police Department Press Releases',
    type: 'releases',
    url: 'https://www.uticapd.com/press-releases', // TODO: confirm real URL and add scraping logic
  },
  {
    id: 'oneida-sheriff-blotter',
    name: 'Oneida County Sheriff Blotter',
    type: 'releases',
    url: 'https://www.oneidacountysheriff.us/blotter', // TODO: confirm real URL and add scraping logic
  },
];

async function ingestPolice() {
  console.log('[ingest:police] Starting police data ingestion...');
  
  const calls: PoliceCall[] = [];
  const releases: PoliceRelease[] = [];

  for (const source of POLICE_SOURCES) {
    try {
      console.log(`[ingest:police] Fetching from ${source.name}: ${source.url}`);
      // TODO: Uncomment and implement scraping logic with cheerio
      // const html = await fetchText(source.url);
      // const $ = cheerio.load(html);
      // 
      // if (source.type === 'calls') {
      //   Parse HTML to extract call data:
      //   - timestamp, agency, description, location, sourceUrl
      //   - Push to calls array
      // } else {
      //   Parse HTML to extract press release data:
      //   - title, publishedAt, summary, sourceUrl
      //   - Push to releases array
      // }
      
      console.log(`[ingest:police] TODO: Add cheerio scraping logic for ${source.id}`);
    } catch (err) {
      console.error(`[ingest:police] Failed to process ${source.id}:`, err);
    }
  }

  // For now, generate sample data to demonstrate the structure
  console.log('[ingest:police] Using sample data (TODO: replace with real scraping)');
  const sampleCalls: PoliceCall[] = [
    {
      id: 'call-sample-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      agency: 'Utica PD',
      description: 'Sample traffic accident',
      location: 'Genesee St & Court St, Utica',
      sourceUrl: 'https://example.com/calls/sample1',
    },
    {
      id: 'call-sample-2',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      agency: 'Rome PD',
      description: 'Sample medical emergency',
      location: 'N Washington St, Rome',
    },
  ];

  const sampleReleases: PoliceRelease[] = [
    {
      id: 'release-sample-1',
      title: 'Sample Arrest Announcement',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      summary: 'Sample police department announces arrest in connection with recent incidents.',
      sourceUrl: 'https://example.com/releases/sample1',
    },
    {
      id: 'release-sample-2',
      title: 'Sample Community Safety Alert',
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      summary: 'Sample alert regarding increased vigilance in local neighborhoods.',
      sourceUrl: 'https://example.com/releases/sample2',
    },
  ];

  calls.push(...sampleCalls);
  releases.push(...sampleReleases);

  const data = { calls, releases };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('[ingest:police] Wrote', calls.length, 'calls and', releases.length, 'releases to', OUTPUT_PATH);
}

ingestPolice().catch((err) => {
  console.error('[ingest:police] Error', err);
  process.exit(1);
});
