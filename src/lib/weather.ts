// ============================================================================
// NWS API Integration for Oneida County News Hub
// ============================================================================

import type { WeatherAlert } from './models';

export type WeatherSummary = {
  location: string;
  updatedAt: string;
  temperatureF: number;
  condition: string;
  icon?: string;
  shortForecast: string;
  todayHighF?: number;
  tonightLowF?: number;
};

// ============================================================================
// NWS API Types
// ============================================================================

interface NWSPointResponse {
  properties: {
    gridId: string;
    gridX: number;
    gridY: number;
    forecast: string;
    forecastHourly: string;
  };
}

interface NWSForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

interface NWSForecastResponse {
  properties: {
    updated: string;
    periods: NWSForecastPeriod[];
  };
}

// ============================================================================
// Low-level NWS Fetch Helper
// ============================================================================

async function nwsFetchJson(url: string): Promise<any> {
  const userAgent = process.env.NWS_USER_AGENT || 'OneidaCountyNewsHub/1.0 (contact@example.com)';
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      'Accept': 'application/geo+json',
    },
    // Add timeout and cache control
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`NWS request failed: ${res.status} ${res.statusText} for ${url}`);
  }

  return res.json();
}

// ============================================================================
// NWS API Functions
// ============================================================================

/**
 * Get NWS point metadata (grid coordinates and forecast URLs)
 */
export async function getNwsPoint(lat: number, lon: number) {
  try {
    const url = `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`;
    const data: NWSPointResponse = await nwsFetchJson(url);
    
    return {
      gridId: data.properties.gridId,
      gridX: data.properties.gridX,
      gridY: data.properties.gridY,
      forecastUrl: data.properties.forecast,
      forecastHourlyUrl: data.properties.forecastHourly,
    };
  } catch (error) {
    console.error('[weather] Failed to fetch NWS point data', error);
    throw error;
  }
}

/**
 * Get NWS forecast (7-day, 12-hour periods)
 */
export async function getNwsForecast(forecastUrl: string): Promise<NWSForecastPeriod[]> {
  try {
    const data: NWSForecastResponse = await nwsFetchJson(forecastUrl);
    return data.properties.periods;
  } catch (error) {
    console.error('[weather] Failed to fetch NWS forecast', error);
    throw error;
  }
}

/**
 * Get current-ish conditions from hourly forecast
 */
export async function getNwsCurrentConditionsFromHourly(hourlyUrl: string) {
  try {
    const data: NWSForecastResponse = await nwsFetchJson(hourlyUrl);
    const firstPeriod = data.properties.periods[0];
    
    return {
      temperature: firstPeriod.temperature,
      temperatureUnit: firstPeriod.temperatureUnit,
      shortForecast: firstPeriod.shortForecast,
      windSpeed: firstPeriod.windSpeed,
      windDirection: firstPeriod.windDirection,
      icon: firstPeriod.icon,
      updated: data.properties.updated,
    };
  } catch (error) {
    console.error('[weather] Failed to fetch NWS current conditions', error);
    throw error;
  }
}

/**
 * Get active NWS alerts for New York State
 */
async function getNwsAlertsForNY(): Promise<WeatherAlert[]> {
  const url = 'https://api.weather.gov/alerts/active?area=NY';

  const res = await fetch(url, {
    headers: {
      'User-Agent': process.env.NWS_USER_AGENT || 'OneidaCountyNewsHub/1.0 (contact@example.com)',
      'Accept': 'application/geo+json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`NWS alerts request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  const features = Array.isArray(data.features) ? data.features : [];

  return features.map((f: any) => {
    const p = f.properties || {};
    return {
      id: f.id || p.id || crypto.randomUUID(),
      event: p.event,
      headline: p.headline,
      description: p.description,
      instruction: p.instruction,
      severity: p.severity,
      urgency: p.urgency,
      certainty: p.certainty,
      effective: p.effective,
      onset: p.onset,
      expires: p.expires,
      ends: p.ends,
      senderName: p.senderName,
      areaDesc: p.areaDesc,
      sourceUrl: p.uri,
    } as WeatherAlert;
  });
}

/**
 * Get NWS alerts filtered for Oneida County region
 */
export async function getOneidaCountyAlerts(): Promise<WeatherAlert[]> {
  try {
    const alerts = await getNwsAlertsForNY();

    // Simple filter: keep alerts that mention "Oneida" or "Utica" or "Rome" in areaDesc or description
    const regionAlerts = alerts.filter((a) => {
      const text = (a.areaDesc || '') + ' ' + (a.description || '');
      return /oneida|utica|rome/i.test(text);
    });

    // Sort by severity & time (optional)
    return regionAlerts;
  } catch (error) {
    console.error('[weather] Failed to fetch NWS alerts', error);
    return [];
  }
}

// ============================================================================
// Open-Meteo Fallback
// ============================================================================

type OpenMeteoCurrent = {
  temperature_2m: number;
  apparent_temperature?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  weathercode?: number;
};

/**
 * Get current weather from Open-Meteo API (fallback source)
 */
async function getOpenMeteoCurrentWeather(lat: number, lon: number): Promise<OpenMeteoCurrent | null> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat.toString());
  url.searchParams.set('longitude', lon.toString());
  url.searchParams.set('current', 'temperature_2m,apparent_temperature,weathercode,wind_speed_10m,wind_direction_10m');
  url.searchParams.set('temperature_unit', 'fahrenheit');
  url.searchParams.set('wind_speed_unit', 'mph');
  url.searchParams.set('timezone', 'auto');

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Open-Meteo request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.current) return null;
    const c = data.current;
    return {
      temperature_2m: c.temperature_2m,
      apparent_temperature: c.apparent_temperature,
      wind_speed_10m: c.wind_speed_10m,
      wind_direction_10m: c.wind_direction_10m,
      weathercode: c.weathercode,
    };
  } catch (error) {
    console.error('[weather] Open-Meteo fetch failed', error);
    return null;
  }
}

/**
 * Map Open-Meteo weather code to condition
 */
function mapOpenMeteoWeatherCode(code?: number): string {
  if (!code) return 'Unknown';
  
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain Showers';
  if (code <= 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorms';
  
  return 'Varied Conditions';
}

// ============================================================================
// Main Weather Summary Function
// ============================================================================

/**
 * Get weather summary for a specific location using NWS API with Open-Meteo fallback
 */
export async function getWeatherSummaryForLocation(
  lat: number,
  lon: number,
  label: string
): Promise<WeatherSummary> {
  // Try NWS first
  try {
    // Step 1: Get point metadata
    const point = await getNwsPoint(lat, lon);
    
    // Step 2: Get forecast periods
    const forecastPeriods = await getNwsForecast(point.forecastUrl);
    
    // Step 3: Get current conditions from hourly
    const current = await getNwsCurrentConditionsFromHourly(point.forecastHourlyUrl);
    
    // Step 4: Extract today's high and tonight's low
    let todayHighF: number | undefined;
    let tonightLowF: number | undefined;
    
    for (const period of forecastPeriods) {
      if (period.isDaytime && !todayHighF) {
        todayHighF = period.temperature;
      } else if (!period.isDaytime && !tonightLowF) {
        tonightLowF = period.temperature;
      }
      if (todayHighF && tonightLowF) break;
    }
    
    // Step 5: Map to WeatherSummary
    return {
      location: label,
      updatedAt: current.updated || new Date().toISOString(),
      temperatureF: current.temperature,
      condition: extractCondition(current.shortForecast),
      icon: extractIconName(current.icon),
      shortForecast: current.shortForecast,
      todayHighF,
      tonightLowF,
    };
  } catch (nwsError) {
    console.error(`[weather] NWS failed for ${label}, trying Open-Meteo fallback`, nwsError);
    
    // Try Open-Meteo as fallback
    const openMeteoData = await getOpenMeteoCurrentWeather(lat, lon);
    if (openMeteoData) {
      const condition = mapOpenMeteoWeatherCode(openMeteoData.weathercode);
      return {
        location: label,
        updatedAt: new Date().toISOString(),
        temperatureF: openMeteoData.temperature_2m,
        condition,
        shortForecast: `${condition}. Feels like ${Math.round(openMeteoData.apparent_temperature || openMeteoData.temperature_2m)}°F`,
        todayHighF: undefined,
        tonightLowF: undefined,
      };
    }
    
    // If both fail, throw the error to let caller handle fallback
    throw nwsError;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract a simple condition name from NWS shortForecast
 */
function extractCondition(shortForecast: string): string {
  const lower = shortForecast.toLowerCase();
  
  if (lower.includes('sunny')) return 'Sunny';
  if (lower.includes('clear')) return 'Clear';
  if (lower.includes('cloudy')) return 'Cloudy';
  if (lower.includes('partly')) return 'Partly Cloudy';
  if (lower.includes('rain')) return 'Rain';
  if (lower.includes('snow')) return 'Snow';
  if (lower.includes('storm')) return 'Storms';
  if (lower.includes('fog')) return 'Foggy';
  
  // Default: return first few words
  return shortForecast.split('.')[0].split(',')[0];
}

/**
 * Extract icon name from NWS icon URL
 */
function extractIconName(iconUrl: string): string {
  try {
    const match = iconUrl.match(/\/icons\/[^/]+\/[^/]+\/([^/,?]+)/);
    return match ? match[1] : 'default';
  } catch {
    return 'default';
  }
}

// ============================================================================
// Mock Data Fallback
// ============================================================================

function getMockWeatherSummary(): WeatherSummary {
  return {
    location: "Utica, NY",
    updatedAt: new Date().toISOString(),
    temperatureF: 42,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
    shortForecast: "Increasing clouds overnight.",
    todayHighF: 48,
    tonightLowF: 34,
  };
}

function getMockWeatherData(): WeatherSummary[] {
  return [
    {
      location: "Utica, NY",
      updatedAt: new Date().toISOString(),
      temperatureF: 42,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      shortForecast: "Increasing clouds overnight.",
      todayHighF: 48,
      tonightLowF: 34
    },
    {
      location: "Rome, NY",
      updatedAt: new Date().toISOString(),
      temperatureF: 40,
      condition: "Mostly Cloudy",
      icon: "cloudy",
      shortForecast: "Cloudy with a chance of snow showers.",
      todayHighF: 46,
      tonightLowF: 32
    },
    {
      location: "Utica, NY",
      updatedAt: new Date(Date.now() + 24*60*60*1000).toISOString(),
      temperatureF: 38,
      condition: "Snow Showers",
      icon: "snow",
      shortForecast: "Snow showers likely. High near 38F."
    },
    {
      location: "Rome, NY",
      updatedAt: new Date(Date.now() + 48*60*60*1000).toISOString(),
      temperatureF: 35,
      condition: "Mostly Sunny",
      icon: "sunny",
      shortForecast: "Turning sunny. High near 35F."
    },
    {
      location: "Utica, NY",
      updatedAt: new Date(Date.now() + 72*60*60*1000).toISOString(),
      temperatureF: 42,
      condition: "Partly Sunny",
      icon: "partly-sunny",
      shortForecast: "Partly sunny. High near 42F."
    },
    {
      location: "Rome, NY",
      updatedAt: new Date(Date.now() + 96*60*60*1000).toISOString(),
      temperatureF: 45,
      condition: "Rain/Snow Likely",
      icon: "rain-snow",
      shortForecast: "Chance of mixed precip. High near 45F."
    },
    {
      location: "Utica, NY",
      updatedAt: new Date(Date.now() + 120*60*60*1000).toISOString(),
      temperatureF: 40,
      condition: "Cloudy",
      icon: "cloudy",
      shortForecast: "Cloudy skies. High near 40F."
    },
    {
      location: "Rome, NY",
      updatedAt: new Date(Date.now() + 144*60*60*1000).toISOString(),
      temperatureF: 43,
      condition: "Mostly Sunny",
      icon: "mostly-sunny",
      shortForecast: "Mostly sunny and milder. High near 43F."
    }
  ];
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get primary weather summary (Utica, NY) with fallback to mock data
 */
export async function getPrimaryWeatherSummary(): Promise<WeatherSummary> {
  const uticaLat = 43.1009;
  const uticaLon = -75.2327;

  try {
    return await getWeatherSummaryForLocation(uticaLat, uticaLon, 'Utica, NY');
  } catch (error) {
    console.error('[weather] Failed to fetch NWS weather, falling back to mock data', error);
    return getMockWeatherSummary();
  }
}

/**
 * Get weather summary for Rome, NY with fallback
 */
export async function getRomeWeatherSummary(): Promise<WeatherSummary> {
  const romeLat = 43.2128;
  const romeLon = -75.4557;

  try {
    return await getWeatherSummaryForLocation(romeLat, romeLon, 'Rome, NY');
  } catch (error) {
    console.error('[weather] Failed to fetch NWS weather for Rome, falling back to mock data', error);
    return {
      location: "Rome, NY",
      updatedAt: new Date().toISOString(),
      temperatureF: 40,
      condition: "Mostly Cloudy",
      icon: "cloudy",
      shortForecast: "Cloudy with a chance of snow showers.",
      todayHighF: 46,
      tonightLowF: 32
    };
  }
}

/**
 * Legacy function for backward compatibility - returns Utica + Rome + mock extended forecast
 */
export async function getWeather(): Promise<WeatherSummary[]> {
  try {
    // Fetch real data for Utica and Rome
    const utica = await getPrimaryWeatherSummary();
    const rome = await getRomeWeatherSummary();
    
    // Return just the two current conditions for now
    // Extended forecast will be handled separately in the weather page
    return [utica, rome, ...getMockWeatherData().slice(2)];
  } catch (error) {
    console.error('[weather] Complete weather fetch failed, using all mock data', error);
    return getMockWeatherData();
  }
}

/**
 * Get detailed forecast periods for a location
 */
export async function getDetailedForecast(lat: number, lon: number): Promise<NWSForecastPeriod[]> {
  try {
    const point = await getNwsPoint(lat, lon);
    return await getNwsForecast(point.forecastUrl);
  } catch (error) {
    console.error('[weather] Failed to get detailed forecast', error);
    throw error;
  }
}

/**
 * Get detailed forecast for Utica with fallback
 */
export async function getUticaDetailedForecast(): Promise<NWSForecastPeriod[]> {
  const uticaLat = 43.1009;
  const uticaLon = -75.2327;
  
  try {
    return await getDetailedForecast(uticaLat, uticaLon);
  } catch (error) {
    console.error('[weather] Failed to get Utica detailed forecast', error);
    // Return empty array on error - caller should handle gracefully
    return [];
  }
}

// ============================================================================
// Hourly Forecast
// ============================================================================

export type HourlyPoint = {
  time: string;       // ISO
  temperatureF: number;
  shortForecast?: string;
};

/**
 * Get hourly forecast for Utica
 */
export async function getUticaHourlyForecast(): Promise<HourlyPoint[]> {
  const uticaLat = 43.1009;
  const uticaLon = -75.2327;

  try {
    const point = await getNwsPoint(uticaLat, uticaLon);
    const data = await nwsFetchJson(point.forecastHourlyUrl);

    const periods = (data.properties?.periods || []) as any[];
    return periods.map((p) => ({
      time: p.startTime,
      temperatureF: p.temperature,
      shortForecast: p.shortForecast,
    }));
  } catch (error) {
    console.error('[weather] Failed to get Utica hourly forecast', error);
    return [];
  }
}

// ============================================================================
// Multi-City Dashboard
// ============================================================================

const LOCATIONS = [
  { id: 'utica', label: 'Utica, NY', lat: 43.1009, lon: -75.2327 },
  { id: 'rome', label: 'Rome, NY', lat: 43.2128, lon: -75.4557 },
  { id: 'new_hartford', label: 'New Hartford, NY', lat: 43.0734, lon: -75.2874 },
  { id: 'whitesboro', label: 'Whitesboro, NY', lat: 43.1267, lon: -75.2993 },
];

export type MultiCityWeather = {
  id: string;
  label: string;
  summary: WeatherSummary;
};

/**
 * Get weather summaries for multiple cities in the Mohawk Valley
 */
export async function getMultiCityWeatherSummary(): Promise<MultiCityWeather[]> {
  const results = await Promise.all(
    LOCATIONS.map(async (loc) => {
      try {
        const summary = await getWeatherSummaryForLocation(loc.lat, loc.lon, loc.label);
        return { id: loc.id, label: loc.label, summary };
      } catch (error) {
        console.error(`[weather] Failed to fetch weather for ${loc.label}`, error);
        // Return a fallback summary
        return {
          id: loc.id,
          label: loc.label,
          summary: {
            location: loc.label,
            updatedAt: new Date().toISOString(),
            temperatureF: 0,
            condition: 'Unavailable',
            shortForecast: 'Weather data temporarily unavailable',
          },
        };
      }
    })
  );
  return results;
}
