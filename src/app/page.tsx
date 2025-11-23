import Link from 'next/link';
import { getNewsItems } from '@/lib/data';
import { cameras } from '@/data/cameras';
import { linkCategories } from '@/data/links';
import { getWeather, type WeatherSummary } from '@/lib/weather';
import AlertsBanner from '@/components/weather/AlertsBanner';
import AdSlot from '@/components/ads/AdSlot';

async function WeatherWidget() {
  const weatherData = await getWeather();
  const uticaCurrent = weatherData[0];
  const romeCurrent = weatherData[1];

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Weather</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h4 className="font-semibold text-lg">{uticaCurrent.location}</h4>
          <p className="text-3xl font-bold">{uticaCurrent.temperatureF}°F</p>
          <p className="capitalize">{uticaCurrent.condition}</p>
          <p>{uticaCurrent.shortForecast}</p>
          <p className="text-sm opacity-90">Updated: {new Date(uticaCurrent.updatedAt).toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-700 text-white p-6 rounded-lg shadow-lg">
          <h4 className="font-semibold text-lg">{romeCurrent.location}</h4>
          <p className="text-3xl font-bold">{romeCurrent.temperatureF}°F</p>
          <p className="capitalize">{romeCurrent.condition}</p>
          <p>{romeCurrent.shortForecast}</p>
          <p className="text-sm opacity-90">Updated: {new Date(romeCurrent.updatedAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="pt-4">
        <h5 className="font-semibold mb-2">7-Day Forecast</h5>
        <ul className="space-y-1 text-sm">
          {weatherData.slice(2).map((day, i) => (
            <li key={i} className="flex justify-between">
              <span>Day {i + 1}</span>
              <span>{day.temperatureF}°F - {day.condition}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function Home() {
  const weatherData = await getWeather();
  const { localNews, regionalNews, nationalNews, govNews } = await getNewsItems();

  const breakingNews = [...localNews, ...govNews.slice(0, 14)]; // ~20 total
  const regionalNational = [...regionalNews, ...nationalNews];

  const quickLinks = linkCategories.find(cat => cat.id === 'local-gov')?.links.slice(0, 5) || [];

  return (
    <>
      <AlertsBanner />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Breaking/Local News */}
      <section className="lg:col-span-1 space-y-6">
        <h2 className="text-2xl font-bold border-b pb-3">Breaking / Local News</h2>
        <div className="space-y-4">
          {breakingNews.slice(0, 6).map((item) => (
            <article key={item.id} className="group">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border hover:border-gray-200"
              >
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-700 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{item.sourceName}</p>
                {item.summary && (
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">{item.summary}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{new Date(item.publishedAt).toLocaleDateString()}</p>
                {item.tags && (
                  <ul className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag, i) => (
                      <li key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </a>
            </article>
          ))}
          
          {/* Inline ad after first batch of articles */}
          <AdSlot
            category="localNews"
            placement="inline"
            count={1}
            title="Featured Local Business"
          />
          
          {breakingNews.slice(6).map((item) => (
            <article key={item.id} className="group">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border hover:border-gray-200"
              >
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-700 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{item.sourceName}</p>
                {item.summary && (
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">{item.summary}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{new Date(item.publishedAt).toLocaleDateString()}</p>
                {item.tags && (
                  <ul className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag, i) => (
                      <li key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Middle Column: Regional/National */}
      <section className="lg:col-span-1 space-y-6">
        <h2 className="text-2xl font-bold border-b pb-3">Regional / State / National</h2>
        <div className="space-y-4">
          {regionalNational.map((item) => (
            <article key={item.id} className="group">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border hover:border-gray-200"
              >
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-700 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{item.sourceName}</p>
                {item.summary && (
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">{item.summary}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{new Date(item.publishedAt).toLocaleDateString()}</p>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Right Column: Widgets */}
      <section className="lg:col-span-1 space-y-6">
        <WeatherWidget />
        
        {/* Sidebar ads */}
        <AdSlot
          category="home"
          placement="sidebar"
          count={2}
          title="Local Sponsors"
        />
        
        <section aria-labelledby="cameras-heading">
          <h3 id="cameras-heading" className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Live Cameras</h3>
          <div className="grid grid-cols-1 gap-4">
            {cameras.slice(0,4).map((camera) => (
              <div key={camera.id} className="group">
                <a
                  href={camera.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border hover:border-gray-200 text-center"
                >
                  <h4 className="font-semibold text-lg mb-1">{camera.title}</h4>
                  {camera.location && <p className="text-sm text-gray-600 mb-2">{camera.location}</p>}
                  {camera.notes && <p className="text-xs text-gray-500">{camera.notes}</p>}
                </a>
              </div>
            ))}
            <Link
              href="/cameras"
              className="block w-full text-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Cameras
            </Link>
          </div>
        </section>
        <section aria-labelledby="quick-links-heading">
          <h3 id="quick-links-heading" className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Quick Links</h3>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border hover:border-gray-200 text-sm"
              >
                <span className="font-medium">{link.label}</span>
                {link.description && <span className="block text-xs text-gray-500 mt-1">{link.description}</span>}
              </a>
            ))}
          </div>
        </section>
      </section>
      </div>
    </>
  );
}
