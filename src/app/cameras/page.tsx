import Link from 'next/link';
import { cameras } from '@/data/cameras';

export const metadata = {
  title: 'Traffic Cameras - Oneida County News Hub',
  description: 'Live traffic and webcam views for Utica, Rome, and Oneida County area.',
};

export default function CamerasPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Home
        </Link>
      </div>
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Live Cameras
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Traffic cams and webcams from NYSDOT 511NY, Utica Harbor, and local sources for Utica, Rome, and surrounding areas.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <article key={camera.id} className="group">
            <a
              href={camera.viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border hover:border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm font-medium">Live View</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{camera.title}</h3>
                {camera.location && (
                  <p className="text-gray-600 mb-2">{camera.location}</p>
                )}
                {camera.notes && (
                  <p className="text-sm text-gray-500 mb-4">{camera.notes}</p>
                )}
                <div className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View Live
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
