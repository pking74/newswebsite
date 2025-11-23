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

## Display Advertising System

The site features a **flexible first-party display advertising system** that allows you to control what ads appear in each section of the site, with support for multiple advertisers per category and configurable placements.

### Overview

The advertising system is designed for **local first-party ads** (direct relationships with local businesses), with no external ad network integration (like Google AdSense). All ads are configured via TypeScript files, making it easy to add, remove, or modify advertisers without database dependencies.

### Key Features

- ✅ **Category-based targeting**: Show different ads on Sports, Weather, Obits, Events pages, etc.
- ✅ **Multiple placements**: Configure ad slots like sidebar, topOfPage, inline, header, footer
- ✅ **Multiple advertisers per category**: Rotate ads from different sponsors in each section
- ✅ **Weighted rotation**: Control how often each ad appears using weight values
- ✅ **Date scheduling**: Set start/end dates for ad campaigns
- ✅ **Active/inactive toggle**: Easily enable or disable ads without deleting them
- ✅ **Zero external dependencies**: All configuration in TypeScript, no database required

### How It Works

1. **Configure ads** in `src/data/ads.ts` - Define advertisers, images, categories, placements
2. **Place ad slots** with `<AdSlot>` component - Server-side selection of eligible ads
3. **Weighted random selection** - Automatically rotates ads based on weight and availability
4. **Category + placement matching** - Only shows ads configured for that page/position

### File Structure

```
src/
├── lib/
│   ├── models.ts          # Ad types: AdCategory, AdPlacement, AdCreative
│   └── ads.ts             # Selection logic: getAdsForPlacement()
├── data/
│   └── ads.ts             # Ad configuration (edit this to manage ads)
└── components/
    └── ads/
        └── AdSlot.tsx     # Reusable ad display component
```

### Ad Configuration

Edit `src/data/ads.ts` to manage your advertisers:

```typescript
export const ads: AdCreative[] = [
  {
    id: "ad-local-restaurant-1",
    advertiserName: "Mohawk Valley Bistro",
    label: "Local restaurant - home & local news sidebar",
    imageUrl: "/ads/mvbistro-300x250.jpg",
    imageAlt: "Mohawk Valley Bistro - Dinner Specials",
    targetUrl: "https://example.com/mvbistro",
    headline: "Support local dining",
    bodyText: "Weekend specials and live music in downtown Utica.",
    categories: ["home", "localNews", "events"],
    placements: ["sidebar"],
    weight: 3,
    active: true,
  },
  // ... more ads
];
```

### Ad Properties

Each ad has these configurable properties:

**Required**:
- `id` - Unique identifier
- `advertiserName` - Business name
- `targetUrl` - Click destination
- `categories` - Array of where ad can show: `"home"`, `"sports"`, `"weather"`, `"obits"`, `"events"`, `"police"`, `"localNews"`, `"generic"`
- `placements` - Array of slots: `"sidebar"`, `"topOfPage"`, `"inline"`, `"header"`, `"footer"`, `"betweenBlocks"`
- `active` - Boolean to enable/disable

**Optional**:
- `label` - Internal note (not displayed)
- `imageUrl` - Path to image (e.g., `/ads/mybusiness-300x250.jpg`)
- `imageAlt` - Image alt text
- `headline` - Text headline (shown if no image or as fallback)
- `bodyText` - Additional description
- `weight` - Number (default: 1), higher = more frequent rotation
- `startDate` - ISO date string, ad only shows on/after this date
- `endDate` - ISO date string, ad stops showing before this date

### Placing Ads on Pages

Use the `<AdSlot>` component in any page:

```tsx
import AdSlot from '@/components/ads/AdSlot';

export default function SportsPage() {
  return (
    <main>
      {/* Top banner ad */}
      <AdSlot
        category="sports"
        placement="topOfPage"
        count={1}
        title="Sponsored"
      />
      
      {/* Content here... */}
      
      {/* Sidebar ads */}
      <AdSlot
        category="sports"
        placement="sidebar"
        count={2}
        title="Local Sports Sponsors"
      />
    </main>
  );
}
```

### Current Ad Placements

Ads are currently integrated on these pages:

- **Home page** (`/`)
  - Sidebar: 2 ads (home category)
  - Inline: 1 ad in local news column (localNews category)

- **Sports page** (`/sports`)
  - Top of page: 1 ad
  - Inline: 1 ad between sections

- **Weather page** (`/weather`)
  - Top of page: 1 ad
  - Sidebar: 1 ad

- **Obits page** (`/obits`)
  - Sidebar: 1 ad

- **Events page** (`/events`)
  - Top of page: 1 ad
  - Sidebar: 1 ad

### Adding Ad Images

1. **Create the ad creative** (300×250 for sidebar, 728×90 for banners, etc.)
2. **Save to public/ads/** directory:
   ```bash
   public/
   └── ads/
       ├── mybusiness-300x250.jpg
       ├── mybusiness-728x90.jpg
       └── ... (your ad images)
   ```
3. **Reference in ads.ts**:
   ```typescript
   imageUrl: "/ads/mybusiness-300x250.jpg"
   ```

### Managing Ads

**Add a new advertiser**:
1. Edit `src/data/ads.ts`
2. Add new entry to the `ads` array
3. Set categories, placements, and weight
4. Deploy or restart dev server

**Disable an ad**:
```typescript
{
  id: "ad-xyz",
  // ...
  active: false,  // ← Set to false
}
```

**Schedule an ad campaign**:
```typescript
{
  id: "ad-holiday-sale",
  // ...
  startDate: "2024-12-01T00:00:00Z",
  endDate: "2024-12-31T23:59:59Z",
  active: true,
}
```

**Control rotation frequency**:
```typescript
// Ad A will show 3× more often than Ad B
{ id: "ad-a", weight: 3, /* ... */ },
{ id: "ad-b", weight: 1, /* ... */ },
```

### Example: Multiple Advertisers

```typescript
// Three businesses can all show in sports sidebar
[
  {
    id: "ad-sports-bar",
    advertiserName: "The Rinkside Sports Bar",
    categories: ["sports"],
    placements: ["sidebar"],
    weight: 4,
    active: true,
  },
  {
    id: "ad-sporting-goods",
    advertiserName: "Rome Sporting Goods",
    categories: ["sports"],
    placements: ["sidebar"],
    weight: 2,
    active: true,
  },
  {
    id: "ad-auto-dealer",
    advertiserName: "Rome Auto Mall",
    categories: ["sports", "home", "generic"],
    placements: ["sidebar"],
    weight: 2,
    active: true,
  },
]

// AdSlot will randomly pick based on weights
<AdSlot category="sports" placement="sidebar" count={2} />
```

### Generic Ads

Use the `"generic"` category for ads that can appear anywhere:

```typescript
{
  id: "ad-generic-realtor",
  advertiserName: "Valley Realty",
  categories: ["generic"],  // ← Can show on any page
  placements: ["sidebar"],
  weight: 1,
  active: true,
}
```

### Future Enhancements

The advertising system can be extended to support:

1. **Dynamic JSON configuration**:
   - Read from `data/generated/ads.json` instead of TypeScript
   - Enable runtime ad updates without redeploying

2. **Admin Interface**:
   - Build a simple admin panel for non-technical users
   - Add/edit/remove advertisers via UI

3. **Analytics**:
   - Track impressions and clicks
   - Use `onclick` handlers or `/api/track` endpoint
   - Generate reports for advertisers

4. **External ad networks**:
   - Integrate Google AdSense or other platforms
   - Use as fallback when no first-party ads available

5. **A/B testing**:
   - Test different creatives for same advertiser
   - Optimize based on performance

6. **Frequency capping**:
   - Limit how often same ad shows to same user
   - Requires cookies or session storage

### Best Practices

- **Keep image sizes consistent** within each placement type (e.g., all sidebar ads 300×250)
- **Optimize images** for web (compress JPGs, use WebP when possible)
- **Test responsive behavior** on mobile devices
- **Set reasonable weights** - avoid too much variance (e.g., don't use weight:100 vs weight:1)
- **Use descriptive `label` fields** for internal organization
- **Backup ad images** - keep originals in case you need to recreate ads

### Admin Dashboard

**NEW**: A comprehensive admin interface for managing ads with visual CRUD operations.

#### Features

- **Visual Dashboard** at `/admin/ads`
  - List all ads in an organized table
  - Add new ads via form interface
  - Edit existing ads with inline form
  - Delete ads with confirmation
  - Save all changes to `data/generated/ads.json`
  
- **Raw JSON Editor** at `/admin/ads/json`
  - Power user tool for direct JSON editing
  - Live validation and formatting
  - Useful for bulk operations

#### Setup

1. **Enable admin tools** in `.env.local`:
   ```bash
   ADMIN_ENABLED=true
   ADMIN_PASSWORD="your-secure-password"
   ```

   Admin features require:
   - `ADMIN_ENABLED=true`
   - `ADMIN_PASSWORD` set
   - Login at `/admin/login`

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Navigate to the admin dashboard**:
   ```
   http://localhost:3000/admin/ads
   ```

#### How It Works

- **API Route**: `/api/admin/ads` (GET/PUT endpoints)
  - GET: Fetches current ad configuration (JSON override or static fallback)
  - PUT: Validates and saves JSON to `data/generated/ads.json`
  
- **Admin Dashboard**: `/admin/ads`
  - View all ads in a table with advertiser, categories, placements, and status
  - Click "Edit" to modify an ad in the sidebar form
  - Click "Delete" to remove an ad (with confirmation)
  - Click "+ New Ad" to add a new advertiser
  - Click "Save All Changes" to persist updates to disk
  - Changes are held in memory until explicitly saved
  
- **JSON Editor**: `/admin/ads/json`
  - Direct JSON editing for power users
  - Format and reset buttons
  - Useful for bulk imports or advanced operations

- **Override System**: 
  - If `data/generated/ads.json` exists and is valid, it overrides `src/data/ads.ts`
  - If JSON file is missing or invalid, falls back to static TypeScript configuration
  - Changes take effect immediately (cache is cleared on server restart)

#### JSON Structure

```json
{
  "ads": [
    {
      "id": "ad-local-restaurant-1",
      "advertiserName": "Mohawk Valley Bistro",
      "label": "Local restaurant - home & local news sidebar",
      "imageUrl": "/ads/mvbistro-300x250.jpg",
      "imageAlt": "Mohawk Valley Bistro - Dinner Specials",
      "targetUrl": "https://example.com/mvbistro",
      "headline": "Support local dining",
      "bodyText": "Weekend specials and live music in downtown Utica.",
      "categories": ["home", "localNews", "events"],
      "placements": ["sidebar"],
      "weight": 3,
      "active": true
    }
  ]
}
```

#### Validation

The API validates each ad entry for:
- Required fields: `id`, `advertiserName`, `targetUrl` (strings)
- Required arrays: `categories`, `placements`
- Required boolean: `active`
- Valid JSON syntax

#### Security Notes

⚠️ **Important**: The admin interface is **not production-ready** for public internet:

- No authentication/authorization yet
- Controlled only by `ADMIN_ENABLED` environment variable
- Suitable for:
  - Local development
  - Internal networks
  - Behind proxy authentication
  - Preview deployments with access controls

**Future enhancements**:
- Add authentication (password, OAuth, etc.)
- Implement role-based access control
- Add audit logging for changes
- Support for secret header or API key

#### Workflow Example

**Dashboard**:
1. Visit `/admin/ads`
2. Click "+ New Ad" to add an advertiser
3. Fill in advertiser details, select categories and placements
4. Click "Add Ad" (changes held locally)
5. Repeat for more ads, or edit existing ones
6. Click "Save All Changes" to persist to disk
7. Refresh any page to see updated ads

**JSON Editor**:
1. Visit `/admin/ads/json` via the dashboard link
2. Edit the JSON configuration directly
3. Click "Format JSON" to clean up formatting
4. Click "Save" to write changes to disk
5. Click "Reset" to discard unsaved changes

#### Ad Reports

**NEW**: Track ad impressions with simple file-based analytics.

##### Features

- **Impression Tracking**: Automatically records when ads are displayed
  - Client-side tracker fires on ad mount
  - POST `/api/ads/impression` endpoint (no auth required)
  - Data stored in `data/generated/ad-metrics.json`
  
- **Reports Dashboard** at `/admin/ads/reports`
  - Table view of all ads with impression counts
  - Sorted by highest impressions first
  - Shows advertiser, label, categories, placements, and total impressions
  - Requires `ADMIN_ENABLED=true`

##### How It Works

1. **Client-side tracking**:
   - Each `<AdSlot>` includes an `<AdImpressionTracker>` component
   - On mount, the tracker sends a POST request to `/api/ads/impression`
   - The API increments the counter for that ad ID

2. **Metrics storage**:
   ```json
   {
     "impressionsByAdId": {
       "ad-local-restaurant-1": 123,
       "ad-local-hvac-1": 87
     },
     "updatedAt": "2025-01-01T12:34:56.000Z"
   }
   ```

3. **Admin reports**:
   - Visit `/admin/ads/reports` (link in admin dashboard header)
   - View all ads with their impression counts
   - Data persists across server restarts via JSON file
   - No database required

##### Important Notes

- **Simple model**: 1 impression = 1 ad render (no viewability tracking)
- **No user tracking**: Doesn't use cookies or track individual users
- **Multiple mounts**: Same user refreshing = multiple impressions (acceptable for now)
- **No fraud prevention**: Basic counting, no IP throttling or deduplication (yet)
- **File-based**: All data in JSON, easy to backup/inspect/reset

##### Future Enhancements

Potential improvements for more sophisticated analytics:

1. **Click tracking**: Add click-through rate (CTR) measurement
2. **User deduplication**: Use session storage or cookies to count unique viewers
3. **Time-on-page**: Weight impressions by actual viewability duration
4. **Geographic data**: Track impressions by IP location (for regional ads)
5. **Export reports**: CSV/Excel downloads for advertiser reporting
6. **Charts & graphs**: Visual trends over time
7. **Rate limiting**: Prevent impression inflation from bots
8. **Database migration**: Move to SQL/NoSQL for better querying

#### Tips

- **Dashboard**:
  - Changes are local until you click "Save All Changes"
  - Delete confirmations prevent accidental removals
  - The form validates required fields before submission
  - Edit mode disables the ID field to prevent duplicates
  - Use the JSON editor link for bulk operations

- **JSON Editor**:
  - Use "Format JSON" before saving to ensure readability
  - Useful for copying ad configs between environments
  - Good for bulk imports from external sources

- **Reports**:
  - Impressions accumulate over time in `ad-metrics.json`
  - To reset counts, delete or edit `ad-metrics.json`
  - Use reports to see which ads are getting the most exposure
  - Sorted view helps identify top performers

- **General**:
  - Test on staging/preview before production
  - Keep a backup of `data/generated/ads.json` before major changes
  - Check browser console for detailed error messages
  - Server logs will show warnings about JSON parsing issues

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
