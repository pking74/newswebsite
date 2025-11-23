import AdsEditor from "@/components/admin/AdsEditor";

export const dynamic = "force-dynamic";

export default function AdminAdsJsonPage() {
  return (
    <main className="max-w-5xl mx-auto py-8 px-4 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Ad Configuration – Raw JSON</h1>
      <p className="text-sm text-gray-600">
        Power tool: edit the raw JSON stored in <code>data/generated/ads.json</code>.
      </p>
      <AdsEditor />
    </main>
  );
}
