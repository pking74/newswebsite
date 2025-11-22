import Link from 'next/link';
import { getWeather, type WeatherSummary } from '@/lib/weather';

export const metadata = {
  title: 'Weather - Oneida County News Hub',
  description: '7-day forecast for Utica, Rome, and Oneida County from National Weather Service.',
};

export default async function WeatherPage() {
  const weatherData = await getWeather();

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
          Detailed 7-day forecast for Utica and Rome, NY. Mock data - replace lib/weather.ts with real NWS API.
        </p>
      </header>

      {/* Current Weather */}
      <section aria-labelledby="current-heading">
        <h2 id="current-heading" className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
          Current Conditions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {weatherData.slice(0,2).map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-10 rounded-xl shadow-2xl text-center">
              <h3 className="text-2xl font-bold mb-4">{item.location}</h3>
              <p className="text-6xl font-black mb-2">{item.temperatureF}°F</p>
              <p className="text-2xl capitalize mb-4 font-semibold">{item.condition}</p>
              <p className="text-lg mb-6">{item.shortForecast}</p>
              <p className="text-sm opacity-90">Updated: {new Date(item.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7-Day Forecast */}
      <section aria-labelledby="forecast-heading">
        <h2 id="forecast-heading" className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
          7-Day Forecast
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weatherData.map((day, i) => (
            <article key={i} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border">
              <h4 className="font-bold text-lg mb-2">
                {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `Day ${i + 1}`}
              </h4>
              <p className="text-3xl font-black text-gray-900 mb-2">{day.temperatureF}°F</p>
              <p className="capitalize text-xl font-semibold mb-4 text-gray-800">{day.condition}</p>
              <p className="text-gray-700 leading-relaxed">{day.shortForecast}</p>
              <p className="text-sm text-gray-500 mt-4">
                Updated: {new Date(day.updatedAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      </section>
      <div className="text-center text-lg text-gray-600 italic p-8 bg-gray-50 rounded-lg">
        Data from National Weather Service. Replace with real API in lib/weather.ts using Utica coords (43.1008°N, 75.2232°W).
      </div>
    </div>
  );
}
