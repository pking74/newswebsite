import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { AdCreative } from "@/lib/models";
import { ads as staticAds } from "@/data/ads";

type AdsJsonFile = {
  ads: AdCreative[];
};

const ADMIN_ENABLED = process.env.ADMIN_ENABLED === "true";

function forbidden(message: string) {
  return NextResponse.json({ error: message }, { status: 403 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

const ADS_JSON_PATH = path.join(process.cwd(), "data/generated/ads.json");

async function readAdsJsonFile(): Promise<AdsJsonFile | null> {
  try {
    const raw = await fs.readFile(ADS_JSON_PATH, "utf-8");
    return JSON.parse(raw) as AdsJsonFile;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!ADMIN_ENABLED) {
    return forbidden("Admin API is disabled. Set ADMIN_ENABLED=true to enable.");
  }

  const file = await readAdsJsonFile();
  const data: AdsJsonFile = file ?? { ads: staticAds };

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!ADMIN_ENABLED) {
    return forbidden("Admin API is disabled. Set ADMIN_ENABLED=true to enable.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const parsed = body as AdsJsonFile;
  if (!parsed || !Array.isArray(parsed.ads)) {
    return badRequest("Expected JSON with an 'ads' array.");
  }

  // Basic shape validation
  for (const ad of parsed.ads) {
    if (typeof ad.id !== "string" || typeof ad.advertiserName !== "string" || typeof ad.targetUrl !== "string") {
      return badRequest("Each ad must have at least 'id', 'advertiserName', and 'targetUrl' as strings.");
    }
    if (!Array.isArray(ad.categories) || !Array.isArray(ad.placements)) {
      return badRequest("Each ad must have 'categories' and 'placements' arrays.");
    }
    if (typeof ad.active !== "boolean") {
      return badRequest("Each ad must have an 'active' boolean field.");
    }
  }

  // Ensure directory exists
  await fs.mkdir(path.dirname(ADS_JSON_PATH), { recursive: true });
  await fs.writeFile(ADS_JSON_PATH, JSON.stringify(parsed, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
