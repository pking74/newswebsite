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
- **Weather**: Real-time data from **National Weather Service (NWS) API** with fallback to mock data.
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

## Weather Integration

The site uses the **National Weather Service (NWS) API** to display real-time weather data for Utica and Rome, NY.

### Setup

1. **Copy the environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your User-Agent** in `.env.local`:
   ```bash
   NWS_USER_AGENT="OneidaCountyNewsHub/1.0 (your-email@example.com)"
   ```
   
   Replace `your-email@example.com` with your actual contact email. This is **required** by the NWS API terms of service.

### How It Works

- **Current Conditions**: Fetched from NWS hourly forecast endpoint
- **7-Day Forecast**: Retrieved from NWS forecast endpoint with 12-hour periods
- **Locations**: 
  - Utica, NY (43.1009°N, 75.2327°W)
  - Rome, NY (43.2128°N, 75.4557°W)
- **Caching**: Weather data is cached for 5 minutes to respect API limits
- **Fallback**: Automatically falls back to mock data if the NWS API is unavailable

### API Reference

Weather functions in `src/lib/weather.ts`:
- `getPrimaryWeatherSummary()` - Get Utica current conditions
- `getRomeWeatherSummary()` - Get Rome current conditions
- `getUticaDetailedForecast()` - Get 7-day detailed forecast periods
- `getWeather()` - Legacy function for backward compatibility

Documentation: https://www.weather.gov/documentation/services-web-api

## Future Work

1. **Real Data Ingestion**:
   - News/Obits: Cron scrapers (Puppeteer/Cheerio) for Utica OD, Rome Sentinel, WKTV, Legacy.com.
   - Police/911: Real feeds if available.
   - Events: Eventbrite/Oneida tourism APIs.
   - Replace `src/data/*.ts` imports.

2. **Weather**: ✅ **IMPLEMENTED** - Now using real NWS API data

3. **Enhancements**:
   - Mobile nav hamburger.
   - Search.
   - Dark mode.
   - PWA.

## Deploy

Vercel/Netlify (static export possible). Update `config/site.ts` baseUrl.

Questions? See About page.
