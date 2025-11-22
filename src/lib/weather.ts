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

export async function getWeather(): Promise<WeatherSummary[]> {
  // Mock NWS response for Utica/Rome area. Replace with real fetch to https://api.weather.gov/points/43.1008,-75.2232
  const mockData: WeatherSummary[] = [
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
    // Day 2
    {
      location: "Utica, NY",
      updatedAt: new Date(Date.now() + 24*60*60*1000).toISOString(),
      temperatureF: 38,
      condition: "Snow Showers",
      icon: "snow",
      shortForecast: "Snow showers likely. High near 38F."
    },
    // Day 3
    {
      location: "Rome, NY",
      updatedAt: new Date(Date.now() + 48*60*60*1000).toISOString(),
      temperatureF: 35,
      condition: "Mostly Sunny",
      icon: "sunny",
      shortForecast: "Turning sunny. High near 35F."
    },
    // Day 4
    {
      location: "Utica, NY",
      updatedAt: new Date(Date.now() + 72*60*60*1000).toISOString(),
      temperatureF: 42,
      condition: "Partly Sunny",
      icon: "partly-sunny",
      shortForecast: "Partly sunny. High near 42F."
    },
    // Day 5
    {
      location: "Rome, NY",
      updatedAt: new Date(Date.now() + 96*60*60*1000).toISOString(),
      temperatureF: 45,
      condition: "Rain/Snow Likely",
      icon: "rain-snow",
      shortForecast: "Chance of mixed precip. High near 45F."
    },
    // Day 6
    {
      location: "Utica, NY",
      updatedAt: new Date(Date.now() + 120*60*60*1000).toISOString(),
      temperatureF: 40,
      condition: "Cloudy",
      icon: "cloudy",
      shortForecast: "Cloudy skies. High near 40F."
    },
    // Day 7
    {
      location: "Rome, NY",
      updatedAt: new Date(Date.now() + 144*60*60*1000).toISOString(),
      temperatureF: 43,
      condition: "Mostly Sunny",
      icon: "mostly-sunny",
      shortForecast: "Mostly sunny and milder. High near 43F."
    }
  ];

  return mockData;
}
