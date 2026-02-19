"use client";

import { useState } from "react";
import { usePages } from "@/hooks/use-pages";
import { useAnalytics } from "@/hooks/use-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { TopLinksTable } from "@/components/dashboard/top-links-table";

const PERIODS = ["7d", "30d", "90d"] as const;
type Period = (typeof PERIODS)[number];

export default function AnalyticsPage() {
  const { pages, isLoading: pagesLoading } = usePages();
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [period, setPeriod] = useState<Period>("7d");

  const pageId = selectedPageId || pages[0]?.id || "";
  const { overview, timeseries, isLoading } = useAnalytics(pageId, period);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-page-title">Analytics</h1>
        <div className="flex items-center gap-3">
          {/* Page selector */}
          {!pagesLoading && pages.length > 1 && (
            <select
              value={pageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="text-small bg-bg-secondary border border-border-primary rounded-md px-2 py-1"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || p.slug}
                </option>
              ))}
            </select>
          )}

          {/* Period selector */}
          <div className="flex border border-border-primary rounded-md overflow-hidden">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-small transition-colors ${
                  period === p
                    ? "bg-accent text-text-inverse"
                    : "bg-bg-primary text-text-secondary hover:bg-bg-hover"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!pageId ? (
        <p className="text-body text-text-secondary">
          Create a page to see analytics.
        </p>
      ) : isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="space-y-8">
          {overview && (
            <MetricsRow
              views={overview.views}
              clicks={overview.clicks}
              ctr={overview.ctr}
              emailCaptures={overview.email_captures}
            />
          )}

          {timeseries && <AnalyticsChart data={timeseries} />}

          {overview && (
            <TopLinksTable pageId={pageId} period={period} />
          )}
        </div>
      )}
    </div>
  );
}
