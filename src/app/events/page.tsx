import Link from 'next/link';
import { events } from '@/data/events';

export const metadata = {
  title: 'Events - Oneida County News Hub',
  description: 'Upcoming events in Utica, Rome, and Oneida County.',
};

export default function EventsPage() {
  const sortedEvents = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div className="max-w-4xl mx-auto space-y-12 px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Home
        </Link>
      </div>
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Upcoming Events
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Community, sports, music, government, and festival events in Utica, Rome, and Oneida County.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sortedEvents.map((event) => (
          <article key={event.id} className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border p-8 hover:border-blue-200">
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-blue-600 transition-colors"
            >
              <h3 className="text-2xl font-bold mb-4 line-clamp-2 group-hover:text-blue-600">{event.title}</h3>
              <div className="space-y-3 mb-6">
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(event.start).toLocaleDateString()} {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {event.end && (
                    <>
                      <span> - {new Date(event.end).toLocaleDateString()} {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </>
                  )}
                </p>
                {event.location && <p className="text-gray-700"><span className="font-semibold">Location:</span> {event.location}</p>}
                {event.organizer && <p className="text-gray-700"><span className="font-semibold">Organizer:</span> {event.organizer}</p>}
              </div>
              {event.category && (
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-6">
                  {event.category}
                </span>
              )}
            </a>
          </article>
        ))}
      </div>
      <div className="text-center">
        <p className="text-lg text-gray-600 italic">
          More events powered by Oneida County tourism sites and Eventbrite coming soon.
        </p>
      </div>
    </div>
  );
}
