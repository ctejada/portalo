"use client";

import useSWR from "swr";

interface BreakdownItem {
  name: string;
  count: number;
}

interface BreakdownData {
  referrers: BreakdownItem[];
  countries: BreakdownItem[];
}

async function fetcher(url: string): Promise<BreakdownData> {
  const res = await fetch(url);
  if (!res.ok) return { referrers: [], countries: [] };
  const json = await res.json();
  return json.data;
}

interface BreakdownTablesProps {
  pageId: string;
  period: string;
}

export function BreakdownTables({ pageId, period }: BreakdownTablesProps) {
  const { data } = useSWR(
    pageId ? `/api/v1/analytics/breakdown?page_id=${pageId}&period=${period}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (!data || (data.referrers.length === 0 && data.countries.length === 0)) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <MiniTable title="Referrers" items={data.referrers} />
      <MiniTable title="Countries" items={data.countries} />
    </div>
  );
}

function MiniTable({ title, items }: { title: string; items: BreakdownItem[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-body-strong mb-2">{title}</h3>
      <table className="w-full text-small">
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-b border-border-secondary">
              <td className="py-1.5 truncate">{item.name}</td>
              <td className="py-1.5 text-right text-text-secondary">
                {item.count.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
