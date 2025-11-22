import Link from 'next/link';
import { policeCalls, policeReleases } from '@/data/police';

export const metadata = {
  title: 'Police / 911 - Oneida County News Hub',
  description: 'Latest 911 activity and police press releases for Utica, Rome, and Oneida County.',
};

export default function PolicePage() {
  const sortedCalls = [...policeCalls].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0,10);
  const sortedReleases = [...policeReleases].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0,10);

  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Home
        </Link>
      </div>
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Police / 911
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Latest 911 activity summaries and recent press releases from Utica PD, Rome PD, Oneida County Sheriff, and State Police.
        </p>
      </header>

      {/* Latest 911 Activity */}
      <section aria-labelledby="911-heading">
        <h2 id="911-heading" className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
          911 Activity (Latest 10)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedCalls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(call.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.agency || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                    {call.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {call.location || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <a
            href="https://oneidacounty911.com/full-summary"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Go to Full 911 Summary
          </a>
        </div>
      </section>

      {/* Recent Press Releases */}
      <section aria-labelledby="releases-heading">
        <h2 id="releases-heading" className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
          Recent Press Releases (Latest 10)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedReleases.map((release) => (
            <article key={release.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border p-6">
              <a
                href={release.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-blue-600 transition-colors"
              >
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{release.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-3">{release.summary}</p>
                <p className="text-sm text-gray-500">
                  {new Date(release.publishedAt).toLocaleDateString()}
                </p>
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
