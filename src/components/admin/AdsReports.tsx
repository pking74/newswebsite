"use client";

import { useEffect, useState } from "react";
import type { AdCreative } from "@/lib/models";

type Row = {
  ad: AdCreative;
  impressions: number;
};

type MetricsResponse = {
  updatedAt: string;
  rows: Row[];
};

export default function AdsReports() {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/ad-metrics", { cache: "no-store" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to load: ${res.status}`);
        }
        const json: MetricsResponse = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("[AdsReports] load error", err);
        setError(err.message ?? "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading reports…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!data || !data.rows.length) {
    return <p className="text-sm text-gray-500">No impression data recorded yet.</p>;
  }

  return (
    <section className="space-y-3">
      <p className="text-xs text-gray-500">
        Last updated: {new Date(data.updatedAt).toLocaleString()}
      </p>
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Advertiser</th>
              <th className="px-3 py-2 text-left font-semibold">Label</th>
              <th className="px-3 py-2 text-left font-semibold">Categories</th>
              <th className="px-3 py-2 text-left font-semibold">Placements</th>
              <th className="px-3 py-2 text-right font-semibold">Impressions</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.ad.id} className="border-t border-gray-200">
                <td className="px-3 py-2">
                  <div className="font-medium">{row.ad.advertiserName}</div>
                  <div className="text-xs text-gray-500">{row.ad.id}</div>
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {row.ad.label || <span className="text-gray-400 italic">—</span>}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {row.ad.categories?.join(", ")}
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">
                  {row.ad.placements?.join(", ")}
                </td>
                <td className="px-3 py-2 text-right text-sm font-semibold">
                  {row.impressions.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
