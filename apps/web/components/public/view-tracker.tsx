"use client";

import { useEffect } from "react";

const VISITOR_COOKIE = "ptl_vid";

function getOrCreateVisitorId(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${VISITOR_COOKIE}=([^;]*)`));
  if (match) return match[1];

  const id = crypto.randomUUID();
  // Set cookie for 1 year, SameSite=Lax for cross-origin safety
  document.cookie = `${VISITOR_COOKIE}=${id}; path=/; max-age=31536000; SameSite=Lax`;
  return id;
}

interface ViewTrackerProps {
  pageId: string;
}

export function ViewTracker({ pageId }: ViewTrackerProps) {
  useEffect(() => {
    const visitorId = getOrCreateVisitorId();

    fetch("/api/v1/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        event_type: "view",
        referrer: document.referrer || undefined,
        visitor_id: visitorId,
      }),
    }).catch(() => {});
  }, [pageId]);

  return null;
}

export { getOrCreateVisitorId };
