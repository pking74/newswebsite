import RSSParser from 'rss-parser';

const parser = new RSSParser();

export async function parseRssFeed(url: string) {
  console.log(`[rss] Parsing RSS feed ${url}`);
  const feed = await parser.parseURL(url);
  return feed.items || [];
}
