import AdsDashboard from "@/components/admin/AdsDashboard";

export const dynamic = "force-dynamic";

export default function AdminAdsDashboardPage() {
  return (
    <main className="max-w-6xl mx-auto py-8 px-4 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ad Management</h1>
          <p className="text-sm text-gray-600">
            View, add, and edit display ads shown across the site. Changes are saved to{" "}
            <code>data/generated/ads.json</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/ads/reports"
            className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            View Reports
          </a>
          <a
            href="/admin/ads/json"
            className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            Open JSON editor
          </a>
        </div>
      </header>
      <AdsDashboard />
    </main>
  );
}
