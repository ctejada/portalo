interface MetricsRowProps {
  views: number;
  clicks: number;
  uniqueViews: number;
  uniqueClicks: number;
  ctr: number;
  bounceRate: number;
  avgTimeToClickMs: number | null;
  emailCaptures: number;
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function MetricsRow({
  views,
  clicks,
  uniqueViews,
  uniqueClicks,
  ctr,
  bounceRate,
  avgTimeToClickMs,
  emailCaptures,
}: MetricsRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricCard label="Unique Views" value={uniqueViews.toLocaleString()} sub={`${views.toLocaleString()} total`} />
      <MetricCard label="Unique Clicks" value={uniqueClicks.toLocaleString()} sub={`${clicks.toLocaleString()} total`} />
      <MetricCard label="CTR" value={`${ctr}%`} />
      <MetricCard label="Bounce Rate" value={`${bounceRate}%`} />
      <MetricCard label="Avg. Time to Click" value={avgTimeToClickMs != null ? formatTime(avgTimeToClickMs) : "—"} />
      <MetricCard label="Emails" value={emailCaptures.toLocaleString()} />
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-secondary p-3">
      <p className="text-caption text-text-secondary">{label}</p>
      <p className="text-heading-sm text-text-primary mt-1">{value}</p>
      {sub && <p className="text-caption text-text-tertiary mt-0.5">{sub}</p>}
    </div>
  );
}
