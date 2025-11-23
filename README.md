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

The site features a **comprehensive weather system** powered by the **National Weather Service (NWS) API** with multiple visualization tools and fallback systems.

### Weather Pages

1. **Main Weather Page** (`/weather`)
   - Current conditions for Utica and Rome, NY
   - 7-day detailed forecast with day/night periods
   - Active weather alerts banner
   - Links to additional weather tools

2. **Weather Alerts** (Banner component)
   - Real-time NWS severe weather alerts for Oneida County region
   - Displays alerts filtered by keywords: Oneida, Utica, Rome
   - Color-coded by severity (Extreme, Severe, Moderate, Minor)
   - Shows effective time, expiration, affected areas, and instructions
   - Automatically appears on home page and weather page when alerts are active

3. **Live Radar Map** (`/weather/radar`)
   - Interactive Leaflet map centered on Oneida County
   - NEXRAD radar overlay from Iowa Environmental Mesonet
   - OpenStreetMap base layer
   - Pan and zoom controls for exploring regional weather patterns

4. **Multi-City Dashboard** (`/weather/cities`)
   - Real-time conditions for 4 Mohawk Valley cities:
     - Utica, NY
     - Rome, NY
     - New Hartford, NY
     - Whitesboro, NY
   - Color-coded weather cards
   - Temperature, conditions, highs/lows for each location

5. **Hourly Temperature Chart** (`/weather/hourly`)
   - Interactive Chart.js line graph
   - Up to 7 days (156 hours) of hourly temperature data
   - Time-series visualization with tooltips
   - Summary statistics: current, high, low, temperature range

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

### Technology Stack

- **NWS API**: Primary data source for all weather information
- **Open-Meteo API**: Automatic fallback if NWS fails (no API key required)
- **Leaflet + react-leaflet**: Interactive maps for radar visualization
- **Chart.js + react-chartjs-2**: Hourly temperature charts
- **chartjs-adapter-date-fns**: Time-series chart support

### Data Flow & Fallback Chain

The weather system uses a **three-tier fallback strategy**:

1. **Primary**: National Weather Service API
   - Official NOAA weather data
   - Detailed forecasts and alerts
   - 5-minute server-side cache

2. **Secondary**: Open-Meteo API
   - Activates automatically if NWS fails
   - Global weather model data
   - No API key required

3. **Tertiary**: Mock data
   - Static fallback ensures site always works
   - Used for development and if both APIs fail

### API Reference

Core weather functions in `src/lib/weather.ts`:

**Current Conditions**:
- `getPrimaryWeatherSummary()` - Utica current weather
- `getRomeWeatherSummary()` - Rome current weather
- `getWeatherSummaryForLocation(lat, lon, label)` - Generic location weather
- `getMultiCityWeatherSummary()` - All 4 cities at once

**Forecasts**:
- `getUticaDetailedForecast()` - 7-day 12-hour periods
- `getUticaHourlyForecast()` - Hourly temperature series

**Alerts**:
- `getOneidaCountyAlerts()` - Active NWS alerts for region

**Component Reference**:
- `<AlertsBanner />` - Server component, displays active alerts
- `<RadarMap />` - Client component, interactive radar
- `<HourlyTempChart points={HourlyPoint[]} />` - Client component, temperature chart

### Dependencies

Weather features require these packages (already in package.json):
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.8",
  "chart.js": "^4.4.1",
  "react-chartjs-2": "^5.2.0",
  "chartjs-adapter-date-fns": "^3.0.0",
  "date-fns": "^3.0.0"
}
```

### Radar Map Notes

- **Base Tiles**: OpenStreetMap (attribution required)
- **Radar Tiles**: NEXRAD via Iowa Environmental Mesonet
- **Alternative**: Can be updated to use official NWS radar tile service
- **CSS**: Leaflet CSS must be imported in `src/app/globals.css`

### External Documentation

- [NWS API Documentation](https://www.weather.gov/documentation/services-web-api)
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [NWS Alerts API](https://www.weather.gov/documentation/services-web-api#/default/alerts_active)

## AI Smart Headlines

The site features an **AI-powered Smart Headlines system** that generates concise, reader-friendly summaries for news items using OpenAI's GPT models, with automatic fallback to heuristic summaries when no API key is configured.

### What Are Smart Headlines?

Smart Headlines are 1-2 sentence summaries that appear beneath news article titles, providing readers with a quick overview of each story without leaving the homepage. This feature is inspired by modern news aggregators and helps users quickly scan and prioritize the news that matters most to them.

### How It Works

1. **Ingestion**: The `ingest:summaries` script reads news items from `data/generated/news.json`
2. **Summarization**: Each article is summarized using:
   - **OpenAI GPT-4o-mini** (default) if `OPENAI_API_KEY` is set
   - **Heuristic fallback** (intelligent text truncation) if no API key
3. **Caching**: Summaries are stored in `data/generated/summaries.json` by article ID
4. **Display**: Summaries are merged with news data at runtime and displayed under headlines

### Key Features

- ✅ **Incremental caching**: Only generates summaries for new articles, avoiding re-billing
- ✅ **Graceful degradation**: Works without API key using heuristic summaries
- ✅ **Cost-effective**: Uses GPT-4o-mini by default (~$0.15 per 1M input tokens)
- ✅ **Modular architecture**: Clean separation between LLM logic and data flow
- ✅ **Zero UI changes required**: Automatically enhances existing news displays

### Setup

1. **Add OpenAI API key** to `.env.local`:
   ```bash
   # Optional: used for AI Smart Headlines
   OPENAI_API_KEY="sk-..."
   
   # Optional: customize the model (default: gpt-4o-mini)
   SMART_HEADLINES_MODEL="gpt-4o-mini"
   ```

2. **Generate summaries**:
   ```bash
   npm run ingest:summaries
   ```

3. **Summaries are cached** in `data/generated/summaries.json` and automatically merged with news items when pages load.

### Running Smart Headlines

```bash
# Generate summaries for all current news items
npm run ingest:summaries

# Run full ingestion including summaries
npm run ingest:all

# Summaries run automatically before build
npm run build  # Runs ingest:all -> ingest:summaries
```

### Cost Considerations

- **GPT-4o-mini pricing** (as of Nov 2024):
  - Input: ~$0.15 per 1M tokens
  - Output: ~$0.60 per 1M tokens
  
- **Typical usage**:
  - ~50-100 tokens per article (input + output)
  - 100 articles = ~10,000 tokens ≈ $0.001-0.01
  - Re-running only processes new articles (cached by ID)

### File Structure

```
src/lib/summary.ts              # LLM + fallback logic
scripts/ingest/summaries.ts     # Ingestion script
data/generated/summaries.json   # Cached summaries by ID
```

### Customization

**Change the model**:
```bash
# In .env.local
SMART_HEADLINES_MODEL="gpt-4o"  # More capable, higher cost
SMART_HEADLINES_MODEL="gpt-3.5-turbo"  # Cheaper alternative
```

**Modify the prompt** in `src/lib/summary.ts`:
- Adjust word count limits
- Change tone or style
- Add domain-specific instructions

**Extend input data**:
Currently summaries use just the article title. To include more context:
1. Modify RSS ingestion to capture `content:encoded` or description
2. Update `scripts/ingest/summaries.ts` to pass description/content to `summarizeNewsItemWithLLM()`

### TODO: Future Enhancements

The following improvements can be added to enhance summary quality:

1. **Pull RSS description/content fields**:
   ```typescript
   // In scripts/ingest/news.ts
   // Extract item.contentSnippet or item.content:encoded
   description: item.contentSnippet || item.content || undefined
   ```

2. **Full article text extraction**:
   - Fetch article HTML from sourceUrl
   - Use readability-like extraction (e.g., `@mozilla/readability`)
   - Respect robots.txt and rate limits
   - Pass fuller text to summarization for better results

3. **Summary variations**:
   - Different styles for local vs. national news
   - Bullet points for complex stories
   - Configurable length per news category

### Fallback Behavior

Without an OpenAI API key, the system uses **heuristic summaries**:
- Takes the article description/content if available
- Falls back to the title
- Intelligently truncates to ~240 characters
- Always works, no external dependencies

### Architecture Highlights

**Separation of concerns**:
- `src/lib/summary.ts`: Pure summarization logic (server-only)
- `scripts/ingest/summaries.ts`: Batch processing script
- `src/lib/data.ts`: Runtime merging of summaries with news
- UI components: No changes needed, just render `item.summary` if present

**Cache strategy**:
```json
{
  "byId": {
    "article-id-1": "One sentence summary...",
    "article-id-2": "Another summary..."
  }
}
```

This approach ensures:
- Fast lookups (O(1) by ID)
- No duplicate API calls
- Easy to inspect/edit manually if needed

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
