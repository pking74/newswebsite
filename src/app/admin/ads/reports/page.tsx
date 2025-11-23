import AdsReports from "@/components/admin/AdsReports";

export const dynamic = "force-dynamic";

export default function AdminAdsReportsPage() {
  return (
    <main className="max-w-6xl mx-auto py-8 px-4 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ad Reports</h1>
          <p className="text-sm text-gray-600">
            Simple impression counts per ad, based on client-side tracking.
          </p>
        </div>
        <a
          href="/admin/ads"
          className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          Back to Ad Management
        </a>
      </header>
      <AdsReports />
    </main>
  );
}
