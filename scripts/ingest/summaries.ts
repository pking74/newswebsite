import fs from "fs/promises";
import path from "path";
import type { NewsItem } from "../../src/lib/models";
import { summarizeNewsItemWithLLM } from "../../src/lib/summary";

type SummariesFile = {
  byId: Record<string, string>;
};

async function readJson<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

async function ingestSummaries() {
  const newsPath = path.join(process.cwd(), "data/generated/news.json");
  const summariesPath = path.join(process.cwd(), "data/generated/summaries.json");

  console.log("[summaries] Reading news data...");
  const newsData = await readJson<{
    localNews: NewsItem[];
    regionalNews: NewsItem[];
    nationalNews: NewsItem[];
    govNews: NewsItem[];
  }>(newsPath, {
    localNews: [],
    regionalNews: [],
    nationalNews: [],
    govNews: [],
  });

  console.log("[summaries] Reading existing summaries...");
  const summariesData = await readJson<SummariesFile>(summariesPath, { byId: {} });

  const allItems: NewsItem[] = [
    ...newsData.localNews,
    ...newsData.regionalNews,
    ...newsData.nationalNews,
    ...newsData.govNews,
  ];

  console.log(`[summaries] Found ${allItems.length} total news items`);
  console.log(`[summaries] Already have ${Object.keys(summariesData.byId).length} summaries cached`);

  let newSummaries = 0;
  let skipped = 0;

  for (const item of allItems) {
    if (!item.id) {
      console.warn(`[summaries] Skipping item without ID: ${item.title}`);
      continue;
    }
    
    if (summariesData.byId[item.id]) {
      skipped++;
      continue; // already summarized
    }

    console.log(`[summaries] Summarizing: "${item.title}" (${item.sourceName})`);

    // For now, we only have title; extend later to include description/content as available.
    // TODO: Pull RSS content:encoded or description field for richer summary input.
    // TODO: Optionally fetch full article HTML (respecting robots.txt) for better summaries.
    const summary = await summarizeNewsItemWithLLM({
      title: item.title,
      description: undefined,
      content: undefined,
      sourceName: item.sourceName,
    });

    summariesData.byId[item.id] = summary;
    newSummaries++;
    
    // Small delay to avoid rate limiting
    if (newSummaries % 10 === 0) {
      console.log(`[summaries] Progress: ${newSummaries} new summaries generated...`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`[summaries] Summary: ${newSummaries} new, ${skipped} skipped (already cached)`);
  
  await fs.mkdir(path.dirname(summariesPath), { recursive: true });
  await fs.writeFile(summariesPath, JSON.stringify(summariesData, null, 2), "utf-8");
  console.log(`[summaries] Wrote data/generated/summaries.json with ${Object.keys(summariesData.byId).length} total summaries`);
}

ingestSummaries().catch((err) => {
  console.error("[summaries] Error:", err);
  process.exit(1);
});
