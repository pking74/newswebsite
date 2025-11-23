# Oneida County News Hub

Lightweight Next.js site aggregating local news, events, obits, police/911, weather, cameras, sports, links for Utica/Rome/Oneida County, NY. Inspired by Newzjunky.com.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Desktop-first 3-column home** like Newzjunky (local news left, regional middle, widgets right).
- **Pages**: Home, Obits (cards), Police (911 table + releases), Cameras (grid), Sports (grouped), Events (cards), Links (categorized), Weather (current + 7-day), About.
- **Static mock data** in `src/data/` (TS types + realistic Utica/Rome/Oneida items).
- **Weather**: Mock NWS-style API at `/api/weather` using `src/lib/weather.ts`.
- **Responsive Tailwind**, semantic HTML, SEO metadata.
- **Outbound links** (target="_blank").

## Structure

```
src/
├── app/               # App Router pages + layout
│   ├── layout.tsx     # Shared header/nav (fixed top)
│   ├── page.tsx       # Home 3-col grid
│   ├── obits/page.tsx
│   ├── police/page.tsx
│   ├── weather/page.tsx + /api/weather/route.ts
│   ├── cameras/page.tsx
│   ├── sports/page.tsx
│   ├── events/page.tsx
│   ├── links/page.tsx
│   └── about/page.tsx
├── config/            # Site config + nav
├── data/              # Mock TS data (fallback data)
│   └── generated/     # Output from ingestion scripts
├── lib/               # Data helpers + weather fetcher
└── globals.css        # Tailwind base

scripts/
├── ingest/            # Data ingestion scripts
│   ├── news.ts        # RSS feed ingestion
│   ├── obits.ts       # Obituary scraping (placeholder)
│   ├── police.ts      # Police data scraping (placeholder)
│   └── events.ts      # Events scraping (placeholder)
└── lib/               # Shared ingestion utilities
    ├── rss.ts         # RSS parser helper
    ├── http.ts        # HTTP fetch helpers
    └── normalize.ts   # Data normalization functions
```

## Data Ingestion

The project includes a **Phase 2 ingestion layer** that fetches real data and generates JSON files in `data/generated/`.

### Running Ingestion Scripts

```bash
# Run individual ingestion scripts
npm run ingest:news     # Fetch news from RSS feeds
npm run ingest:obits    # Scrape obituaries (placeholder)
npm run ingest:police   # Scrape police data (placeholder)
npm run ingest:events   # Scrape events (placeholder)

# Run all ingestion scripts
npm run ingest:all

# Ingestion runs automatically before build
npm run build  # Runs ingest:all first
```

### Generated Data Files

Ingestion scripts write to:
- `data/generated/news.json` - Categorized news (local, regional, national, gov)
- `data/generated/obits.json` - Obituary listings
- `data/generated/police.json` - 911 calls and press releases
- `data/generated/events.json` - Upcoming events

### Fallback Behavior

Pages automatically fall back to mock data in `src/data/` if generated files are missing. This ensures the app **always works** even without running ingestion.

### Current Status

- **News ingestion**: ✅ Fully implemented with RSS parsing
  - Fetches from NPR (working example)
  - Placeholder URLs for local sources (Utica OD, Rome Sentinel, WKTV)
  - Uses `rss-parser` to parse feeds
  - Normalizes and categorizes items
  
- **Obits, Police, Events**: 📝 Scaffold in place
  - Scripts generate sample data
  - TODO comments mark where to add real scraping logic with Cheerio
  - Placeholder source URLs need to be replaced with real Oneida County sites

### Next Steps for Full Ingestion

1. **Confirm real RSS feed URLs** for local news sources
2. **Add Cheerio scraping logic** in obits/police/events scripts:
   ```typescript
   const html = await fetchText(source.url);
   const $ = cheerio.load(html);
   // Add selectors to extract data
   ```
3. **Set up cron jobs** or GitHub Actions to run ingestion periodically
4. **Add error handling** and notifications for failed ingestions

## Future Work

1. **Real Data Ingestion**:
   - News/Obits: Cron scrapers (Puppeteer/Cheerio) for Utica OD, Rome Sentinel, WKTV, Legacy.com.
   - Police/911: Real feeds if available.
   - Events: Eventbrite/Oneida tourism APIs.
   - Replace `src/data/*.ts` imports.

2. **Weather**:
   - `src/lib/weather.ts`: Fetch real NWS API:
     ```
     const uticaPoint = await fetch('https://api.weather.gov/points/43.1008,-75.2232');
     const forecast = await uticaPoint.json();
     // Parse periods[]
     ```

3. **Enhancements**:
   - Mobile nav hamburger.
   - Search.
   - Dark mode.
   - PWA.

## Deploy

Vercel/Netlify (static export possible). Update `config/site.ts` baseUrl.

Questions? See About page.
