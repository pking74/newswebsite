"use client";

import { useEffect, useState } from "react";
import type { AdCreative } from "@/lib/models";
import AdForm from "./AdForm";

type AdsJsonFile = {
  ads: AdCreative[];
};

type Mode = "list" | "create" | "edit";

export default function AdsDashboard() {
  const [ads, setAds] = useState<AdCreative[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/ads", { cache: "no-store" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to load: ${res.status}`);
        }
        const data: AdsJsonFile = await res.json();
        setAds(data.ads);
      } catch (err: any) {
        console.error("[AdsDashboard] load error", err);
        setError(err.message ?? "Failed to load ads.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreateNew = () => {
    setSelectedId(null);
    setMode("create");
    setSaveMessage(null);
    setError(null);
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setMode("edit");
    setSaveMessage(null);
    setError(null);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Delete this ad? This cannot be undone.");
    if (!confirmed) return;
    setAds((prev) => prev.filter((ad) => ad.id !== id));
    setMode("list");
    setSelectedId(null);
    setSaveMessage("Ad deleted locally. Click 'Save All Changes' to persist.");
  };

  const handleCancel = () => {
    setMode("list");
    setSelectedId(null);
    setError(null);
  };

  const handleUpsert = (updated: AdCreative) => {
    setAds((prev) => {
      const idx = prev.findIndex((ad) => ad.id === updated.id);
      if (idx === -1) {
        return [...prev, updated];
      }
      const copy = [...prev];
      copy[idx] = updated;
      return copy;
    });
    setMode("list");
    setSelectedId(null);
    setSaveMessage("Changes applied locally. Don't forget to save all changes.");
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    try {
      const payload: AdsJsonFile = { ads };
      const res = await fetch("/api/admin/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed: ${res.status}`);
      }
      setSaveMessage("All changes saved.");
    } catch (err: any) {
      console.error("[AdsDashboard] save error", err);
      setError(err.message ?? "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const selectedAd =
    mode === "edit" && selectedId
      ? ads.find((ad) => ad.id === selectedId) ?? null
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.5fr] gap-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Ads</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNew}
              className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              + New Ad
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading ads…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {saveMessage && !error && <p className="text-sm text-green-600">{saveMessage}</p>}

        {!loading && !ads.length && (
          <p className="text-sm text-gray-500">No ads configured yet.</p>
        )}

        {!loading && ads.length > 0 && (
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Advertiser</th>
                  <th className="px-3 py-2 text-left font-semibold">Categories</th>
                  <th className="px-3 py-2 text-left font-semibold">Placements</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id} className="border-t border-gray-200">
                    <td className="px-3 py-2">
                      <div className="font-medium">{ad.advertiserName}</div>
                      {ad.label && (
                        <div className="text-xs text-gray-500">{ad.label}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700">
                      {ad.categories?.join(", ")}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700">
                      {ad.placements?.join(", ")}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {ad.active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      <button
                        type="button"
                        onClick={() => handleEdit(ad.id)}
                        className="mr-2 text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {mode === "create" && "Create New Ad"}
          {mode === "edit" && selectedAd && `Edit: ${selectedAd.advertiserName}`}
          {mode === "list" && "Details"}
        </h2>
        {mode === "list" && (
          <p className="text-sm text-gray-500">
            Select an ad to edit, or click <strong>+ New Ad</strong> to add an advertiser.
          </p>
        )}
        {(mode === "create" || (mode === "edit" && selectedAd)) && (
          <AdForm
            key={mode === "create" ? "create" : selectedAd?.id}
            mode={mode}
            initialAd={selectedAd ?? null}
            onCancel={handleCancel}
            onSubmit={handleUpsert}
          />
        )}
      </section>
    </div>
  );
}
