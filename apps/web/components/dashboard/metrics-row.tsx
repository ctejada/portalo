interface MetricsRowProps {
  views: number;
  clicks: number;
  ctr: number;
  emailCaptures: number;
}

export function MetricsRow({ views, clicks, ctr, emailCaptures }: MetricsRowProps) {
  return (
    <div className="flex items-baseline gap-1 text-body flex-wrap">
      <span className="text-body-strong">{views.toLocaleString()}</span>
      <span className="text-text-secondary">views</span>
      <span className="text-text-tertiary mx-1">&middot;</span>
      <span className="text-body-strong">{clicks.toLocaleString()}</span>
      <span className="text-text-secondary">clicks</span>
      <span className="text-text-tertiary mx-1">&middot;</span>
      <span className="text-body-strong">{ctr}%</span>
      <span className="text-text-secondary">CTR</span>
      <span className="text-text-tertiary mx-1">&middot;</span>
      <span className="text-body-strong">{emailCaptures.toLocaleString()}</span>
      <span className="text-text-secondary">emails</span>
    </div>
  );
}
