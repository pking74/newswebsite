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
├── data/              # Mock TS data (replace with scrapers/APIs)
├── lib/               # Weather fetcher (mock -> real NWS)
└── globals.css        # Tailwind base
```

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
