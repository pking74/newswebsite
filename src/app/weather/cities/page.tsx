import Link from 'next/link';
import { getMultiCityWeatherSummary } from '@/lib/weather';

export const metadata = {
  title: 'City Weather - Oneida County News Hub',
  description: 'Current weather conditions for cities across the Mohawk Valley region.',
};

export default async function CitiesPage() {
  const cities = await getMultiCityWeatherSummary();

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4">
      <div className="flex items-center gap-4">
        <Link href="/weather" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Weather
        </Link>
      </div>

      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Multi-City Weather Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Current conditions across the Mohawk Valley region
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cities.map((city) => {
          const { summary } = city;
          const isAvailable = summary.temperatureF !== 0;
          
          return (
            <article
              key={city.id}
              className={`bg-gradient-to-br ${
                isAvailable
                  ? 'from-blue-500 to-blue-700'
                  : 'from-gray-400 to-gray-600'
              } text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300`}
            >
              <h3 className="text-2xl font-bold mb-4">{summary.location}</h3>
              
              {isAvailable ? (
                <>
                  <div className="text-center mb-4">
                    <p className="text-5xl font-black mb-2">{summary.temperatureF}°F</p>
                    <p className="text-xl capitalize font-semibold">{summary.condition}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm opacity-90">
                    <p className="leading-relaxed">{summary.shortForecast}</p>
                    
                    {(summary.todayHighF || summary.tonightLowF) && (
                      <div className="flex justify-around pt-3 border-t border-white/20">
                        {summary.todayHighF && (
                          <div className="text-center">
                            <p className="text-xs opacity-75">High</p>
                            <p className="text-lg font-bold">{summary.todayHighF}°F</p>
                          </div>
                        )}
                        {summary.tonightLowF && (
                          <div className="text-center">
                            <p className="text-xs opacity-75">Low</p>
                            <p className="text-lg font-bold">{summary.tonightLowF}°F</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs opacity-75 mt-4">
                    Updated: {new Date(summary.updatedAt).toLocaleTimeString()}
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg mb-2">⚠️</p>
                  <p className="text-sm">{summary.shortForecast}</p>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About This Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h3 className="font-medium mb-2">Data Source</h3>
            <p>Real-time data from the National Weather Service API</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Update Frequency</h3>
            <p>Weather conditions refresh every 5 minutes</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Coverage</h3>
            <p>Cities in Oneida County and surrounding Mohawk Valley region</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Accuracy</h3>
            <p>Data sourced from official NOAA/NWS observation stations</p>
          </div>
        </div>
      </section>

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
            href="/weather/hourly"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg mb-2">Hourly Chart</h3>
            <p className="text-sm text-gray-600">7-day hourly temperature trends</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
