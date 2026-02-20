"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { useUser } from "@/hooks/use-user";
import { usePages } from "@/hooks/use-pages";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { TopLinksTable } from "@/components/dashboard/top-links-table";
import { BreakdownTables } from "@/components/dashboard/breakdown-tables";
import { HourlyChart } from "@/components/dashboard/hourly-chart";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";

const PERIODS = ["7d", "30d", "90d"] as const;
const PERIOD_LABELS: Record<string, string> = { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days" };
type Period = (typeof PERIODS)[number];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);
  const { user } = useUser();
  const { pages } = usePages();
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>();
  const isPro = user?.plan === "pro" || user?.plan === "business";

  useEffect(() => {
    if (pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);

  const { overview, timeseries, isLoading } = useAnalytics(
    undefined,
    period,
    customRange?.start,
    customRange?.end,
  );

  function handleExportCsv() {
    if (!isPro) return;
    if (!selectedPageId) return;
    const params = new URLSearchParams({ period, page_id: selectedPageId });
    if (customRange) {
      params.set("start_date", customRange.start);
      params.set("end_date", customRange.end);
    }
    window.location.href = `/api/v1/analytics/export?${params}`;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-page-title">Analytics</h1>

        <div className="flex items-center gap-3">
          {/* Page selector (shown when multiple pages exist) */}
          {pages.length > 1 && (
            <select
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="px-2 py-1 text-small border border-border-primary rounded bg-bg-primary text-text-primary"
              aria-label="Select page"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>{p.title || p.slug}</option>
              ))}
            </select>
          )}

          {/* Export CSV button */}
          <button
            onClick={handleExportCsv}
            disabled={!isPro}
            className="px-3 py-1 text-small border border-border-primary rounded-md hover:bg-bg-hover transition-colors flex items-center gap-1.5 disabled:opacity-60"
            title={isPro ? "Export analytics as CSV" : "CSV export requires Pro plan"}
          >
            Export CSV
            {!isPro && <span className="text-[10px] bg-accent text-text-inverse px-1.5 py-0.5 rounded">Pro</span>}
          </button>

          {/* Period selector */}
          <div className={`flex border border-border-primary rounded-md overflow-hidden ${customRange ? "opacity-40" : ""}`} role="radiogroup" aria-label="Time period">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={period === p && !customRange}
                aria-label={PERIOD_LABELS[p]}
                onClick={() => { setPeriod(p); setCustomRange(null); }}
                className={`px-3 py-1 text-small transition-colors ${
                  period === p && !customRange
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

      {/* Custom date range - Pro feature */}
      <div className="mb-6">
        {isPro ? (
          <DateRangePicker
            onRangeChange={(start, end) => setCustomRange({ start, end })}
            onClear={() => setCustomRange(null)}
          />
        ) : (
          <span className="text-small text-text-tertiary flex items-center gap-1.5">
            Custom date range
            <span className="text-[10px] bg-accent text-text-inverse px-1.5 py-0.5 rounded">Pro</span>
          </span>
        )}
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
              uniqueViews={overview.unique_views}
              uniqueClicks={overview.unique_clicks}
              ctr={overview.ctr}
              bounceRate={overview.bounce_rate}
              avgTimeToClickMs={overview.avg_time_to_click_ms}
              emailCaptures={overview.email_captures}
            />
          )}

          {timeseries && <AnalyticsChart data={timeseries} />}

          <HourlyChart period={period} startDate={customRange?.start} endDate={customRange?.end} />

          {overview && (
            <>
              <TopLinksTable period={period} startDate={customRange?.start} endDate={customRange?.end} />
              <BreakdownTables period={period} startDate={customRange?.start} endDate={customRange?.end} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
