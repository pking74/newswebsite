import type { NewsItem, Obit, PoliceCall, PoliceRelease, EventItem } from '../../src/lib/models';

export async function fetchText(url: string): Promise<string> {
  console.log(`[http] Fetching ${url}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OneidaNewsHub/1.0; +https://localhost:3000)',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    console.log(`[http] Fetched ${url} (${text.length} chars)`);
    return text;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`[http] Error fetching ${url}:`, err);
    throw err;
  }
}

export async function fetchJson<T>(url: string): Promise<T> {
  const text = await fetchText(url);
  return JSON.parse(text) as T;
}
