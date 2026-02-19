"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { TopLinksTable } from "@/components/dashboard/top-links-table";
import { BreakdownTables } from "@/components/dashboard/breakdown-tables";

const PERIODS = ["7d", "30d", "90d"] as const;
type Period = (typeof PERIODS)[number];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const { overview, timeseries, isLoading } = useAnalytics(undefined, period);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-page-title">Analytics</h1>

        {/* Period selector */}
        <div className="flex border border-border-primary rounded-md overflow-hidden" role="group" aria-label="Time period">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
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

      {isLoading ? (
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
            <>
              <TopLinksTable period={period} />
              <BreakdownTables period={period} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
