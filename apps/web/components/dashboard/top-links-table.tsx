"use client";

import useSWR from "swr";

interface TopLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
}

async function fetcher(url: string): Promise<TopLink[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

interface TopLinksTableProps {
  pageId?: string;
  period: string;
}

export function TopLinksTable({ pageId, period }: TopLinksTableProps) {
  const params = new URLSearchParams({ period });
  if (pageId) params.set("page_id", pageId);

  const { data: links } = useSWR(
    `/api/v1/analytics/top-links?${params}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (!links || links.length === 0) {
    return (
      <div>
        <h2 className="text-section-title mb-3">Top Links</h2>
        <p className="text-small text-text-tertiary py-4">
          No link clicks recorded for this period. Share your page to start tracking.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-section-title mb-3">Top Links</h2>
      <table className="w-full text-body">
        <thead>
          <tr className="border-b border-border-primary text-text-tertiary text-left">
            <th className="pb-2 font-medium">Link</th>
            <th className="pb-2 font-medium text-right w-20">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-b border-border-secondary">
              <td className="py-2">
                <div className="text-body-strong truncate max-w-xs">{link.title}</div>
                <div className="text-tiny truncate max-w-xs">{link.url}</div>
              </td>
              <td className="py-2 text-right text-body-strong">
                {link.clicks.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
