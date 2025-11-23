import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type AdMetricsFile = {
  impressionsByAdId: Record<string, number>;
  updatedAt: string;
};

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

async function writeMetrics(data: AdMetricsFile): Promise<void> {
  await fs.mkdir(path.dirname(METRICS_PATH), { recursive: true });
  await fs.writeFile(METRICS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const adId = typeof body?.adId === "string" ? body.adId.trim() : "";
  if (!adId) {
    return NextResponse.json({ error: "Missing or invalid 'adId'." }, { status: 400 });
  }

  const metrics = await readMetrics();
  const current = metrics.impressionsByAdId[adId] ?? 0;
  metrics.impressionsByAdId[adId] = current + 1;
  metrics.updatedAt = new Date().toISOString();

  await writeMetrics(metrics);

  // Return minimal response; we don't need to send much back.
  return NextResponse.json({ ok: true });
}
