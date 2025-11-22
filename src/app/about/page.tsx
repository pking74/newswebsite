import Link from 'next/link';

export const metadata = {
  title: 'About - Oneida County News Hub',
  description: 'Curated news hub for Utica, Rome, and Oneida County, NY.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Home
        </Link>
      </div>
      <article className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-8 md:p-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Oneida County News Hub
          </h1>
        </header>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Purpose</h2>
            <p>
              This is a curated link and news hub focused on Utica, Rome, and Oneida County, New York. 
              Inspired by Newzjunky.com, it aggregates outbound links to local news, events, sports, government info, 
              and public services. All content links to third-party sources - no original reporting.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
            <p>
              Links to external sites. We are not responsible for third-party content. Data is mock/static for now - 
              replace with scrapers or APIs as noted in README.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p>
              Questions? Email <a href="mailto:contact@oneidacountynewshub.com" className="text-blue-600 hover:text-blue-800">contact@oneidacountynewshub.com</a>.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Future Work</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Web scraping cron jobs for news/obits/police (Puppeteer/Cheerio).</li>
              <li>Real NWS API in lib/weather.ts (coords: Utica 43.1008,-75.2232).</li>
              <li>Eventbrite/Oneida tourism API integration.</li>
              <li>Real-time 911 feeds.</li>
              <li>Mobile nav hamburger.</li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
