"use client";

import { useEffect } from "react";

const VISITOR_COOKIE = "ptl_vid";

// Page load timestamp for time-to-click measurement
let pageLoadTime: number | null = null;
let firstClickRecorded = false;

function getOrCreateVisitorId(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${VISITOR_COOKIE}=([^;]*)`));
  if (match) return match[1];

  const id = crypto.randomUUID();
  // Set cookie for 1 year, SameSite=Lax for cross-origin safety
  document.cookie = `${VISITOR_COOKIE}=${id}; path=/; max-age=31536000; SameSite=Lax`;
  return id;
}

function detectDevice(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "Other";
}

function getTimeToClick(): number | undefined {
  if (firstClickRecorded || !pageLoadTime) return undefined;
  firstClickRecorded = true;
  const elapsed = Math.round(performance.now() - pageLoadTime);
  // Cap at 5 minutes (300000ms) to match schema max
  return Math.min(elapsed, 300000);
}

interface ViewTrackerProps {
  pageId: string;
}

export function ViewTracker({ pageId }: ViewTrackerProps) {
  useEffect(() => {
    pageLoadTime = performance.now();
    firstClickRecorded = false;

    const visitorId = getOrCreateVisitorId();

    fetch("/api/v1/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        event_type: "view",
        referrer: document.referrer || undefined,
        visitor_id: visitorId,
        device: detectDevice(),
        browser: detectBrowser(),
      }),
    }).catch(() => {});
  }, [pageId]);

  return null;
}

export { getOrCreateVisitorId, detectDevice, detectBrowser, getTimeToClick };
