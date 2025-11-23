"use client";

import { useEffect, useRef } from "react";

type Props = {
  adId: string;
};

export default function AdImpressionTracker({ adId }: Props) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!adId || sentRef.current) return;
    sentRef.current = true;

    async function sendImpression() {
      try {
        await fetch("/api/ads/impression", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adId }),
          keepalive: true, // okay for browsers that support it
        });
      } catch (error) {
        console.error("[AdImpressionTracker] Failed to record impression", error);
      }
    }

    sendImpression();
  }, [adId]);

  return null;
}
