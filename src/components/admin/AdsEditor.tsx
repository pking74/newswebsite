"use client";

import { useEffect, useState } from "react";

type AdsJsonFile = {
  ads: unknown[];
};

type SaveState = "idle" | "saving" | "saved" | "error";

export default function AdsEditor() {
  const [rawJson, setRawJson] = useState<string>("");
  const [initialJson, setInitialJson] = useState<string>("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/ads", { cache: "no-store" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to load: ${res.status}`);
        }
        const data: AdsJsonFile = await res.json();
        const pretty = JSON.stringify(data, null, 2);
        setRawJson(pretty);
        setInitialJson(pretty);
      } catch (err: any) {
        console.error("[AdsEditor] load error", err);
        setError(err.message ?? "Failed to load ads config.");
      }
    }
    load();
  }, []);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const pretty = JSON.stringify(parsed, null, 2);
      setRawJson(pretty);
      setError(null);
    } catch (err: any) {
      setError("Cannot format: JSON is invalid.");
    }
  };

  const handleReset = () => {
    setRawJson(initialJson);
    setError(null);
  };

  const handleSave = async () => {
    setSaveState("saving");
    setError(null);
    try {
      // Validate that it's valid JSON
      const parsed = JSON.parse(rawJson) as AdsJsonFile;
      if (!parsed || !Array.isArray((parsed as any).ads)) {
        throw new Error("Top-level object must have an 'ads' array.");
      }

      const res = await fetch("/api/admin/ads", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed: ${res.status}`);
      }

      setSaveState("saved");
      setInitialJson(rawJson);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err: any) {
      console.error("[AdsEditor] save error", err);
      setError(err.message ?? "Failed to save.");
      setSaveState("error");
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleFormat}
          className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          Format JSON
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="px-4 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saveState === "saving" ? "Saving..." : "Save"}
        </button>
        {saveState === "saved" && (
          <span className="text-sm text-green-600">Saved!</span>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <textarea
        className="w-full h-[480px] font-mono text-xs border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
        value={rawJson}
        onChange={(e) => {
          setRawJson(e.target.value);
          if (saveState !== "idle") setSaveState("idle");
        }}
      />
      <p className="text-xs text-gray-500">
        Be careful! Invalid JSON or incorrect ad structure can break ads. Each ad should match the <code>AdCreative</code> type
        (id, advertiserName, targetUrl, categories, placements, etc.).
      </p>
    </section>
  );
}
