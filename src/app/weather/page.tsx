import Link from 'next/link';
import { getPrimaryWeatherSummary, getRomeWeatherSummary, getUticaDetailedForecast } from '@/lib/weather';
import AlertsBanner from '@/components/weather/AlertsBanner';
import AdSlot from '@/components/ads/AdSlot';

export const metadata = {
  title: 'Weather - Oneida County News Hub',
  description: '7-day forecast for Utica, Rome, and Oneida County from National Weather Service.',
};

export default async function WeatherPage() {
  // Fetch current conditions for both cities
  const uticaCurrent = await getPrimaryWeatherSummary();
  const romeCurrent = await getRomeWeatherSummary();
  
  // Fetch detailed forecast periods for Utica
  const forecastPeriods = await getUticaDetailedForecast();

  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Home
        </Link>
      </div>
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Weather Forecast
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Live weather data from the National Weather Service for Utica and Rome, NY
        </p>
      </header>

      <AlertsBanner />

      {/* Top of page ad */}
      <AdSlot
        category="weather"
        placement="topOfPage"
        count={1}
        title="Sponsored"
      />

      {/* Current Weather */}
      <section aria-labelledby="current-heading">
        <h2 id="current-heading" className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
          Current Conditions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-10 rounded-xl shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">{uticaCurrent.location}</h3>
            <p className="text-6xl font-black mb-2">{uticaCurrent.temperatureF}°F</p>
            <p className="text-2xl capitalize mb-4 font-semibold">{uticaCurrent.condition}</p>
            <p className="text-lg mb-6">{uticaCurrent.shortForecast}</p>
            {(uticaCurrent.todayHighF || uticaCurrent.tonightLowF) && (
              <div className="flex justify-center gap-6 mb-4">
                {uticaCurrent.todayHighF && (
                  <div>
                    <p className="text-sm opacity-80">Today's High</p>
                    <p className="text-2xl font-bold">{uticaCurrent.todayHighF}°F</p>
                  </div>
                )}
                {uticaCurrent.tonightLowF && (
                  <div>
                    <p className="text-sm opacity-80">Tonight's Low</p>
                    <p className="text-2xl font-bold">{uticaCurrent.tonightLowF}°F</p>
                  </div>
                )}
              </div>
            )}
            <p className="text-sm opacity-90">Updated: {new Date(uticaCurrent.updatedAt).toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-500 to-gray-700 text-white p-10 rounded-xl shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">{romeCurrent.location}</h3>
            <p className="text-6xl font-black mb-2">{romeCurrent.temperatureF}°F</p>
            <p className="text-2xl capitalize mb-4 font-semibold">{romeCurrent.condition}</p>
            <p className="text-lg mb-6">{romeCurrent.shortForecast}</p>
            {(romeCurrent.todayHighF || romeCurrent.tonightLowF) && (
              <div className="flex justify-center gap-6 mb-4">
                {romeCurrent.todayHighF && (
                  <div>
                    <p className="text-sm opacity-80">Today's High</p>
                    <p className="text-2xl font-bold">{romeCurrent.todayHighF}°F</p>
                  </div>
                )}
                {romeCurrent.tonightLowF && (
                  <div>
                    <p className="text-sm opacity-80">Tonight's Low</p>
                    <p className="text-2xl font-bold">{romeCurrent.tonightLowF}°F</p>
                  </div>
                )}
              </div>
            )}
            <p className="text-sm opacity-90">Updated: {new Date(romeCurrent.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* Detailed Forecast */}
      <section aria-labelledby="forecast-heading">
        <h2 id="forecast-heading" className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
          Detailed Forecast for {uticaCurrent.location}
        </h2>
        
        {forecastPeriods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {forecastPeriods.slice(0, 14).map((period, i) => (
              <article 
                key={period.number} 
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border ${
                  period.isDaytime ? 'border-yellow-200' : 'border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-lg">{period.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    period.isDaytime ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {period.isDaytime ? '☀️ Day' : '🌙 Night'}
                  </span>
                </div>
                
                <p className="text-4xl font-black text-gray-900 mb-2">
                  {period.temperature}°{period.temperatureUnit}
                </p>
                
                <p className="font-semibold text-lg mb-3 text-gray-800">
                  {period.shortForecast}
                </p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">💨 Wind:</span>
                    <span>{period.windSpeed} {period.windDirection}</span>
                  </p>
                  
                  {period.temperatureTrend && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium">📈 Trend:</span>
                      <span>{period.temperatureTrend}</span>
                    </p>
                  )}
                </div>
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Full Details
                  </summary>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {period.detailedForecast}
                  </p>
                </details>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-lg text-yellow-800 mb-2">
              ⚠️ Detailed forecast temporarily unavailable
            </p>
            <p className="text-sm text-yellow-700">
              Showing current conditions only. The National Weather Service API may be experiencing issues.
              Please check back later.
            </p>
          </div>
        )}
      </section>

      {/* Sidebar ad before tools */}
      <AdSlot
        category="weather"
        placement="sidebar"
        count={1}
        title="Weather Sponsors"
      />

      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">More Weather Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/weather/radar"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg mb-2">🗺️ Live Radar</h3>
            <p className="text-sm text-gray-600">Interactive weather radar map with NWS data</p>
          </Link>
          
          <Link
            href="/weather/cities"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg mb-2">🏙️ City Dashboard</h3>
            <p className="text-sm text-gray-600">Multi-city conditions across the Mohawk Valley</p>
          </Link>
          
          <Link
            href="/weather/hourly"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg mb-2">📊 Hourly Chart</h3>
            <p className="text-sm text-gray-600">7-day hourly temperature trends and analysis</p>
          </Link>
        </div>
      </section>

      <div className="text-center text-sm text-gray-600 p-8 bg-gray-50 rounded-lg border">
        <p className="mb-2">
          <strong>Data Source:</strong> National Weather Service (NWS) API
        </p>
        <p className="mb-2">
          Coordinates: Utica (43.1009°N, 75.2327°W) | Rome (43.2128°N, 75.4557°W)
        </p>
        <p className="text-xs text-gray-500">
          Weather data updates every 5 minutes • NWS forecast periods update hourly
        </p>
      </div>
    </div>
  );
}
