import Link from 'next/link';
import { getObits } from '@/lib/data';

export const metadata = {
  title: 'Obituaries - Oneida County News Hub',
  description: 'Recent obituaries from Utica, Rome, and Oneida County.',
};

export default async function ObitsPage() {
  const obits = await getObits();
  const sortedObits = [...obits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Home
        </Link>
      </div>
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Obituaries
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Recent obituaries from Legacy.com, Utica OD, and local funeral homes in Utica, Rome, and Oneida County.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedObits.map((obit) => (
          <article key={obit.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border p-6">
            <a
              href={obit.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-blue-600 transition-colors"
            >
              <h2 className="text-2xl font-bold mb-2 line-clamp-2">{obit.name}</h2>
              <div className="space-y-1 text-gray-700 mb-4">
                {obit.age && <p><span className="font-semibold">Age:</span> {obit.age}</p>}
                {obit.city && <p><span className="font-semibold">City:</span> {obit.city}</p>}
                {obit.funeralHome && <p><span className="font-semibold">Funeral Home:</span> {obit.funeralHome}</p>}
                <p><span className="font-semibold">Date:</span> {new Date(obit.date).toLocaleDateString()}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
