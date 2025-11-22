import Link from 'next/link';
import { linkCategories } from '@/data/links';

export const metadata = {
  title: 'Links - Oneida County News Hub',
  description: 'Curated links to local government, utilities, schools, media, and more in Oneida County.',
};

export default function LinksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
          ← Back to Home
        </Link>
      </div>
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Useful Links
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Grouped links to local government, utilities, schools, media, transit, and miscellaneous resources for Utica, Rome, and Oneida County.
        </p>
      </header>
      <div className="space-y-12">
        {linkCategories.map((category) => (
          <section key={category.id} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
              {category.name}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.links.map((link) => (
                <li key={link.id} className="group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 border rounded-lg hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:text-blue-600"
                  >
                    <h3 className="font-semibold text-lg mb-1">{link.label}</h3>
                    {link.description && (
                      <p className="text-gray-600">{link.description}</p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
