import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the RadarMap component with SSR disabled
const RadarMap = dynamic(() => import('@/components/weather/RadarMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Loading radar map...</p>
    </div>
  ),
});

export const metadata = {
  title: 'Weather Radar - Oneida County News Hub',
  description: 'Live weather radar for Oneida County and the Mohawk Valley region.',
};

export default function RadarPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4">
      <div className="flex items-center gap-4">
        <Link href="/weather" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Weather
        </Link>
      </div>

      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Live Radar – Oneida County Region
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real-time NEXRAD weather radar coverage for the Utica, Rome, and Mohawk Valley area
        </p>
      </header>

      <section className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-semibold text-lg text-blue-900 mb-2">Map Controls</h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Zoom: Use scroll wheel or +/- buttons</li>
            <li>• Pan: Click and drag the map</li>
            <li>• Radar Layer: Semi-transparent overlay shows precipitation intensity</li>
            <li>• Green/Yellow/Red: Light to heavy precipitation</li>
          </ul>
        </div>

        <RadarMap />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
          <p className="mb-2">
            <strong>Data Source:</strong> NEXRAD radar data via Iowa Environmental Mesonet
          </p>
          <p className="mb-2">
            <strong>Coverage Area:</strong> Centered on Utica, NY (43.10°N, 75.23°W)
          </p>
          <p className="text-xs text-gray-500">
            Radar imagery updates approximately every 5 minutes. Map tiles © OpenStreetMap contributors.
          </p>
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
            href="/weather/cities"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg mb-2">City Dashboard</h3>
            <p className="text-sm text-gray-600">Multi-city conditions across the region</p>
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
