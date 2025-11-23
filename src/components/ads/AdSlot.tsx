import type { AdCategory, AdPlacement, AdCreative } from "@/lib/models";
import { getAdsForPlacement } from "@/lib/ads";
import Image from "next/image";

type AdSlotProps = {
  category: AdCategory;
  placement: AdPlacement;
  count?: number; // how many ads to show
  title?: string; // optional heading above ads
  className?: string;
};

function AdCard({ ad }: { ad: AdCreative }) {
  return (
    <div className="border border-gray-200 bg-white shadow-sm p-2 rounded-md mb-3">
      <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer">
        {ad.imageUrl ? (
          <div className="w-full mb-2">
            <Image
              src={ad.imageUrl}
              alt={ad.imageAlt || ad.advertiserName}
              width={300}
              height={250}
              className="w-full h-auto rounded"
            />
          </div>
        ) : null}
        {ad.headline && (
          <p className="text-sm font-semibold leading-snug">{ad.headline}</p>
        )}
        {ad.bodyText && (
          <p className="mt-1 text-xs text-gray-700">{ad.bodyText}</p>
        )}
        <p className="mt-2 text-[10px] uppercase tracking-wide text-gray-400">
          Advertisement · {ad.advertiserName}
        </p>
      </a>
    </div>
  );
}

export default async function AdSlot(props: AdSlotProps) {
  const { category, placement, count = 1, title, className } = props;

  const ads = await getAdsForPlacement({ category, placement, count });

  if (!ads.length) return null;

  return (
    <section className={className}>
      {title && (
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {title}
        </h2>
      )}
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </section>
  );
}
