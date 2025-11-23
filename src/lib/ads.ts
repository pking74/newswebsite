import { ads as staticAds } from "@/data/ads";
import type { AdCategory, AdCreative, AdPlacement } from "@/lib/models";
import fs from "fs/promises";
import path from "path";

type AdsJsonFile = {
  ads: AdCreative[];
};

/**
 * Try to load ads from the JSON override file.
 * Returns null if file doesn't exist or is invalid.
 */
async function loadAdsJsonOverride(): Promise<AdCreative[] | null> {
  const filePath = path.join(process.cwd(), "data/generated/ads.json");
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as AdsJsonFile;
    if (!parsed || !Array.isArray(parsed.ads)) {
      console.warn("[ads] ads.json has no 'ads' array; ignoring override.");
      return null;
    }
    return parsed.ads;
  } catch (error) {
    // File not found or parse error: log and ignore
    console.warn("[ads] No ads.json override found or could not parse; using static ads.ts");
    return null;
  }
}

let cachedAds: AdCreative[] | null = null;

/**
 * Get all ads, checking for JSON override first, then falling back to static ads.
 */
export async function getAllAds(): Promise<AdCreative[]> {
  if (cachedAds) return cachedAds;
  const override = await loadAdsJsonOverride();
  cachedAds = override ?? staticAds;
  return cachedAds;
}

/**
 * Check if an ad is within its active date range.
 */
function isWithinDateRange(ad: AdCreative, now: Date): boolean {
  if (ad.startDate && new Date(ad.startDate) > now) return false;
  if (ad.endDate && new Date(ad.endDate) <= now) return false;
  return true;
}

/**
 * Get all ads eligible for a specific category and placement.
 */
function getEligibleAds(
  allAds: AdCreative[],
  category: AdCategory,
  placement: AdPlacement,
  now = new Date()
): AdCreative[] {
  return allAds.filter((ad) => {
    if (!ad.active) return false;
    if (!ad.categories.includes(category) && !ad.categories.includes("generic")) {
      return false;
    }
    if (!ad.placements.includes(placement)) return false;
    if (!isWithinDateRange(ad, now)) return false;
    return true;
  });
}

/**
 * Pick random ads from a list, weighted by their weight property.
 * Uses a simple weighted random selection algorithm.
 */
function pickWeightedRandom(adList: AdCreative[], count: number): AdCreative[] {
  if (adList.length <= count) return adList;

  const result: AdCreative[] = [];
  const pool = [...adList];

  while (result.length < count && pool.length > 0) {
    const totalWeight = pool.reduce((sum, ad) => sum + (ad.weight ?? 1), 0);
    let r = Math.random() * totalWeight;
    let chosenIndex = 0;

    for (let i = 0; i < pool.length; i++) {
      const w = pool[i].weight ?? 1;
      if (r < w) {
        chosenIndex = i;
        break;
      }
      r -= w;
    }

    const [chosen] = pool.splice(chosenIndex, 1);
    result.push(chosen);
  }

  return result;
}

/**
 * Get ads for a specific placement on a page.
 * 
 * @param params.category - The content category (e.g., "sports", "weather", "home")
 * @param params.placement - The ad slot position (e.g., "sidebar", "topOfPage")
 * @param params.count - Number of ads to return (default: 1)
 * @returns Array of AdCreative objects to display
 * 
 * @example
 * ```ts
 * const sidebarAds = getAdsForPlacement({
 *   category: "sports",
 *   placement: "sidebar",
 *   count: 2
 * });
 * ```
 * 
 * TODO: In the future, this could be enhanced to:
 * - Read from data/generated/ads.json for dynamic configuration
 * - Support frequency capping (limit impressions per user)
 * - Track impressions and clicks for analytics
 * - Integrate with external ad networks
 */
export async function getAdsForPlacement(params: {
  category: AdCategory;
  placement: AdPlacement;
  count?: number;
}): Promise<AdCreative[]> {
  const { category, placement, count = 1 } = params;
  const allAds = await getAllAds();
  const eligible = getEligibleAds(allAds, category, placement);
  if (eligible.length === 0) return [];
  return pickWeightedRandom(eligible, count);
}
