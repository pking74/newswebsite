import AdsEditor from "@/components/admin/AdsEditor";

export const dynamic = "force-dynamic";

export default function AdminAdsPage() {
  // We let the client component fetch from /api/admin/ads
  return (
    <main className="max-w-5xl mx-auto py-8 px-4 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Ad Configuration (JSON Editor)</h1>
      <p className="text-sm text-gray-600">
        Edit the JSON configuration for display ads. Changes are saved to <code>data/generated/ads.json</code>.
        This overrides the default configuration from <code>src/data/ads.ts</code>.
      </p>
      <AdsEditor />
    </main>
  );
}
