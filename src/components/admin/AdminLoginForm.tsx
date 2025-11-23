"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  nextPath: string;
};

export default function AdminLoginForm({ nextPath }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Login failed: ${res.status}`);
      }

      // On success, redirect to nextPath
      router.push(nextPath);
    } catch (err: any) {
      console.error("[AdminLoginForm] login error", err);
      setError(err.message ?? "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">
          Admin Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
