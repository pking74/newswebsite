// ============================================================================
// NWS API Integration for Oneida County News Hub
// ============================================================================

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

// ============================================================================
// Main Weather Summary Function
// ============================================================================

/**
 * Get weather summary for a specific location using NWS API
 */
export async function getWeatherSummaryForLocation(
  lat: number,
  lon: number,
  label: string
): Promise<WeatherSummary> {
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
  } catch (error) {
    console.error(`[weather] Failed to get weather summary for ${label}`, error);
    throw error;
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
