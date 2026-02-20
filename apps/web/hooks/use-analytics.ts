"use client";

import useSWR from "swr";

interface OverviewData {
  views: number;
  clicks: number;
  unique_views: number;
  unique_clicks: number;
  ctr: number;
  bounce_rate: number;
  avg_time_to_click_ms: number | null;
  email_captures: number;
  top_referrer: string | null;
  top_country: string | null;
  period_days: number;
  new_visitors: number | null;
  returning_visitors: number | null;
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

export function useAnalytics(
  pageId?: string,
  period: "7d" | "30d" | "90d" = "7d",
  startDate?: string,
  endDate?: string,
) {
  const params = new URLSearchParams({ period });
  if (pageId) params.set("page_id", pageId);
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);

  const { data: overview, isLoading: overviewLoading } = useSWR<OverviewData>(
    `/api/v1/analytics/overview?${params}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  const { data: timeseries, isLoading: timeseriesLoading } = useSWR<TimeseriesPoint[]>(
    `/api/v1/analytics/timeseries?${params}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  return {
    overview: overview ?? null,
    timeseries: timeseries ?? null,
    isLoading: overviewLoading || timeseriesLoading,
  };
}
