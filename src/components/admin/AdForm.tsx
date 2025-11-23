"use client";

import { useState } from "react";
import type { AdCreative, AdCategory, AdPlacement } from "@/lib/models";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initialAd: AdCreative | null;
  onCancel: () => void;
  onSubmit: (ad: AdCreative) => void;
};

const ALL_CATEGORIES: AdCategory[] = [
  "home",
  "localNews",
  "regionalNews",
  "nationalNews",
  "sports",
  "weather",
  "obits",
  "police",
  "events",
  "links",
  "generic",
];

const ALL_PLACEMENTS: AdPlacement[] = [
  "header",
  "topOfPage",
  "sidebar",
  "inline",
  "betweenBlocks",
  "footer",
];

export default function AdForm({ mode, initialAd, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<AdCreative>(() => {
    if (initialAd) return initialAd;
    return {
      id: "",
      advertiserName: "",
      label: "",
      imageUrl: "",
      imageAlt: "",
      targetUrl: "",
      headline: "",
      bodyText: "",
      categories: ["home"],
      placements: ["sidebar"],
      weight: 1,
      active: true,
    };
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof AdCreative, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFromArray = <T,>(arr: T[], value: T): T[] => {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  };

  const handleCategoryToggle = (cat: AdCategory) => {
    handleChange("categories", toggleFromArray(form.categories ?? [], cat));
  };

  const handlePlacementToggle = (pl: AdPlacement) => {
    handleChange("placements", toggleFromArray(form.placements ?? [], pl));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.id.trim()) {
      return setError("ID is required. Use a unique string (e.g., 'ad-local-xyz').");
    }
    if (!form.advertiserName.trim()) {
      return setError("Advertiser name is required.");
    }
    if (!form.targetUrl.trim()) {
      return setError("Target URL is required.");
    }
    if (!form.categories || form.categories.length === 0) {
      return setError("Select at least one category.");
    }
    if (!form.placements || form.placements.length === 0) {
      return setError("Select at least one placement.");
    }

    const normalized: AdCreative = {
      ...form,
      id: form.id.trim(),
      advertiserName: form.advertiserName.trim(),
      targetUrl: form.targetUrl.trim(),
      label: form.label?.trim() || undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
      imageAlt: form.imageAlt?.trim() || undefined,
      headline: form.headline?.trim() || undefined,
      bodyText: form.bodyText?.trim() || undefined,
      weight: form.weight ?? 1,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };

    onSubmit(normalized);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-gray-200 rounded-md p-3 bg-white">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            ID (unique)
          </label>
          <input
            type="text"
            value={form.id}
            onChange={(e) => handleChange("id", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="ad-local-restaurant-1"
            disabled={mode === "edit"}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Advertiser Name
          </label>
          <input
            type="text"
            value={form.advertiserName}
            onChange={(e) => handleChange("advertiserName", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Mohawk Valley Bistro"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Label (internal)
          </label>
          <input
            type="text"
            value={form.label ?? ""}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Home & local news sidebar"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Target URL
          </label>
          <input
            type="url"
            value={form.targetUrl}
            onChange={(e) => handleChange("targetUrl", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="https://example.com/mvbistro"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={form.imageUrl ?? ""}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="/ads/mvbistro-300x250.jpg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Image Alt Text
            </label>
            <input
              type="text"
              value={form.imageAlt ?? ""}
              onChange={(e) => handleChange("imageAlt", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Headline (optional)
          </label>
          <input
            type="text"
            value={form.headline ?? ""}
            onChange={(e) => handleChange("headline", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Support local dining"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Body Text (optional)
          </label>
          <textarea
            value={form.bodyText ?? ""}
            onChange={(e) => handleChange("bodyText", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <label key={cat} className="inline-flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={form.categories?.includes(cat) ?? false}
                  onChange={() => handleCategoryToggle(cat)}
                  className="rounded border-gray-300"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Placements
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_PLACEMENTS.map((pl) => (
              <label key={pl} className="inline-flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={form.placements?.includes(pl) ?? false}
                  onChange={() => handlePlacementToggle(pl)}
                  className="rounded border-gray-300"
                />
                <span>{pl}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 items-center">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Weight
            </label>
            <input
              type="number"
              value={form.weight ?? 1}
              onChange={(e) => handleChange("weight", Number(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              min={1}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Active
            </label>
            <select
              value={form.active ? "true" : "false"}
              onChange={(e) => handleChange("active", e.target.value === "true")}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            Higher weight = more likely to show among eligible ads.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Start Date (optional)
            </label>
            <input
              type="date"
              value={form.startDate ?? ""}
              onChange={(e) => handleChange("startDate", e.target.value || undefined)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              End Date (optional)
            </label>
            <input
              type="date"
              value={form.endDate ?? ""}
              onChange={(e) => handleChange("endDate", e.target.value || undefined)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {mode === "create" ? "Add Ad" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
