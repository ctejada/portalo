"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  pageId: string;
}

export function ViewTracker({ pageId }: ViewTrackerProps) {
  useEffect(() => {
    fetch("/api/v1/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        event_type: "view",
        referrer: document.referrer || undefined,
      }),
    }).catch(() => {});
  }, [pageId]);

  return null;
}
