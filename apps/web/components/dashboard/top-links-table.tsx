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
  // Links come from the page's links endpoint, sorted by clicks
  const links = json.data ?? [];
  return links
    .map((l: TopLink) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      clicks: l.clicks,
    }))
    .sort((a: TopLink, b: TopLink) => b.clicks - a.clicks)
    .slice(0, 10);
}

interface TopLinksTableProps {
  pageId: string;
  period: string;
}

export function TopLinksTable({ pageId }: TopLinksTableProps) {
  const { data: links } = useSWR(
    pageId ? `/api/v1/pages/${pageId}/links` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (!links || links.length === 0) {
    return null;
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
