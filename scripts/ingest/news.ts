#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

const OUTPUT_PATH = path.join(process.cwd(), 'data/generated/news.json');

async function ingestNews() {
  console.log('[ingest:news] Starting placeholder (TODO: add RSS parsing)');
  const data = {
    localNews: [],
    regionalNews: [],
    nationalNews: [],
    govNews: [],
  };
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('[ingest:news] Wrote to', OUTPUT_PATH);
}

ingestNews().catch(console.error);
