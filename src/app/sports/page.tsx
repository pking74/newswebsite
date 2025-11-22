import Link from 'next/link';
import { sportsLinks } from '@/data/sports';

export const metadata = {
  title: 'Sports - Oneida County News Hub',
  description: 'High school, college, and pro sports schedules and links for Utica, Rome, Oneida County.',
};

function SportsSection({ level, items }: { level: string; items: typeof sportsLinks }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
        {level}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((link) => (
          <article key={link.id} className="group">
            <a
              href={link.scheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border hover:border-gray-200 p-6 hover:bg-gray-50"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                {link.teamName}
              </h3>
              <p className="text-lg text-gray-700 mb-3">{link.sport}</p>
              {link.notes && <p className="text-sm text-gray-600 mb-4">{link.notes}</p>}
              <div className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                View Schedule
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>
        </article>
      ))}
    </div>
  </section>
);
}

import type { SportsLink } from '@/data/sports';

function SportsSection({ level, items }: { level: string; items: SportsLink[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
        {level}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((link) => (
          <article key={link.id} className="group">
            <a
              href={link.scheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border hover:border-gray-200 p-6 hover:bg-gray-50"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                {link.teamName}
              </h3>
              <p className="text-lg text-gray-700 mb-3">{link.sport}</p>
              {link.notes && <p className="text-sm text-gray-600 mb-4">{link.notes}</p>}
              <div className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                View Schedule
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v
