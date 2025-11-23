import Link from 'next/link';
import { getUticaHourlyForecast } from '@/lib/weather';
import { HourlyTempChart } from '@/components/weather/HourlyTempChart';

export const metadata = {
  title: 'Hourly Temperature - Oneida County News Hub',
  description: 'Hourly temperature forecast for Utica, NY from the National Weather Service.',
};

export default async function HourlyWeatherPage() {
  const points = await getUticaHourlyForecast();

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4">
      <div className="flex items-center gap-4">
        <Link href="/weather" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Weather
        </Link>
      </div>

      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Hourly Temperature – Utica, NY
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Next {points.length} hourly periods from the National Weather Service forecast
        </p>
      </header>

      {points.length > 0 ? (
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Temperature Trend</h2>
            <HourlyTempChart points={points} />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-blue-900 mb-2">Chart Guide</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Hover over data points to see detailed temperature and time information</li>
              <li>• The blue line shows the temperature trend over the next 7 days</li>
              <li>• Shaded area represents temperature range visualization</li>
              <li>• Data updates hourly from the National Weather Service</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Current</p>
                <p className="text-2xl font-bold text-gray-900">{points[0]?.temperatureF}°F</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">High</p>
                <p className="text-2xl font-bold text-red-600">
                  {Math.max(...points.map(p => p.temperatureF))}°F
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Low</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.min(...points.map(p => p.temperatureF))}°F
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Range</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...points.map(p => p.temperatureF)) - Math.min(...points.map(p => p.temperatureF))}°
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-lg text-yellow-800 mb-2">
            ⚠️ Hourly forecast data temporarily unavailable
          </p>
          <p className="text-sm text-yellow-700">
            The National Weather Service API may be experiencing issues. Please check back later.
          </p>
        </div>
      )}

      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">More Weather Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/weather"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg mb-2">Current Conditions</h3>
            <p className="text-sm text-gray-600">View current weather and 7-day forecast</p>
          </Link>
          
          <Link
            href="/weather/radar"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg mb-2">Live Radar</h3>
            <p className="text-sm text-gray-600">Interactive weather radar map</p>
          </Link>
          
          <Link
            href="/weather/cities"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg mb-2">City Dashboard</h3>
            <p className="text-sm text-gray-600">Multi-city conditions across the region</p>
          </Link>
        </div>
      </section>

      <div className="text-center text-sm text-gray-600 p-6 bg-gray-50 rounded-lg border">
        <p className="mb-2">
          <strong>Data Source:</strong> National Weather Service (NWS) Hourly Forecast API
        </p>
        <p className="mb-2">
          <strong>Location:</strong> Utica, NY (43.1009°N, 75.2327°W)
        </p>
        <p className="text-xs text-gray-500">
          Hourly forecast data updates every hour • Covers up to 7 days (156 hours)
        </p>
      </div>
    </div>
  );
}
