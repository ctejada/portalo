"use client";

import useSWR from "swr";

interface BreakdownItem {
  name: string;
  count: number;
}

interface BreakdownData {
  referrers: BreakdownItem[];
  countries: BreakdownItem[];
  browsers: BreakdownItem[];
}

async function fetcher(url: string): Promise<BreakdownData> {
  const res = await fetch(url);
  if (!res.ok) return { referrers: [], countries: [], browsers: [] };
  const json = await res.json();
  return json.data;
}

interface BreakdownTablesProps {
  pageId?: string;
  period: string;
  startDate?: string;
  endDate?: string;
}

export function BreakdownTables({ pageId, period, startDate, endDate }: BreakdownTablesProps) {
  const params = new URLSearchParams({ period });
  if (pageId) params.set("page_id", pageId);
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);

  const { data } = useSWR(
    `/api/v1/analytics/breakdown?${params}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const isEmpty = !data || (data.referrers.length === 0 && data.countries.length === 0 && data.browsers.length === 0);

  if (isEmpty) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-body-strong mb-2">Referrers</h3>
          <p className="text-small text-text-tertiary py-2">No referrer data yet.</p>
        </div>
        <div>
          <h3 className="text-body-strong mb-2">Countries</h3>
          <p className="text-small text-text-tertiary py-2">No location data yet.</p>
        </div>
        <div>
          <h3 className="text-body-strong mb-2">Browsers</h3>
          <p className="text-small text-text-tertiary py-2">No browser data yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MiniTable title="Referrers" items={data.referrers} />
      <MiniTable title="Countries" items={data.countries} />
      <MiniTable title="Browsers" items={data.browsers} />
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
