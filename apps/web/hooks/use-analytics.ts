"use client";

import useSWR from "swr";

interface OverviewData {
  views: number;
  clicks: number;
  ctr: number;
  email_captures: number;
  top_referrer: string | null;
  top_country: string | null;
  period_days: number;
}

interface TimeseriesPoint {
  date: string;
  views: number;
  clicks: number;
  email_captures: number;
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  const json = await res.json();
  return json.data;
}

export function useAnalytics(pageId: string, period: "7d" | "30d" | "90d" = "7d") {
  const { data: overview, isLoading: overviewLoading } = useSWR<OverviewData>(
    pageId ? `/api/v1/analytics/overview?page_id=${pageId}&period=${period}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  const { data: timeseries, isLoading: timeseriesLoading } = useSWR<TimeseriesPoint[]>(
    pageId ? `/api/v1/analytics/timeseries?page_id=${pageId}&period=${period}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  return {
    overview: overview ?? null,
    timeseries: timeseries ?? null,
    isLoading: overviewLoading || timeseriesLoading,
  };
}
