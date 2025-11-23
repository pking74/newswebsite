import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { AdCreative } from "@/lib/models";
import { getAllAds } from "@/lib/ads";

type AdMetricsFile = {
  impressionsByAdId: Record<string, number>;
  updatedAt: string;
};

const ADMIN_ENABLED = process.env.ADMIN_ENABLED === "true";
const METRICS_PATH = path.join(process.cwd(), "data/generated/ad-metrics.json");

async function readMetrics(): Promise<AdMetricsFile> {
  try {
    const raw = await fs.readFile(METRICS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as AdMetricsFile;
    return {
      impressionsByAdId: parsed.impressionsByAdId ?? {},
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return {
      impressionsByAdId: {},
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function GET(req: NextRequest) {
  if (!ADMIN_ENABLED) {
    return NextResponse.json(
      { error: "Admin API is disabled. Set ADMIN_ENABLED=true to enable." },
      { status: 403 }
    );
  }

  const [ads, metrics] = await Promise.all([getAllAds(), readMetrics()]);

  const rows = ads.map((ad) => {
    const impressions = metrics.impressionsByAdId[ad.id] ?? 0;
    return {
      ad,
      impressions,
    };
  });

  // Sort descending by impressions
  rows.sort((a, b) => b.impressions - a.impressions);

  return NextResponse.json({
    updatedAt: metrics.updatedAt,
    rows,
  });
}
