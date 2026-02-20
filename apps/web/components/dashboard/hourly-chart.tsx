"use client";

import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyPoint {
  hour: number;
  views: number;
  clicks: number;
}

async function fetcher(url: string): Promise<HourlyPoint[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data;
}

function formatHour(hour: number): string {
  if (hour === 0) return "12a";
  if (hour === 12) return "12p";
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

interface HourlyChartProps {
  pageId?: string;
  period: string;
}

export function HourlyChart({ pageId, period }: HourlyChartProps) {
  const params = new URLSearchParams({ period });
  if (pageId) params.set("page_id", pageId);

  const { data } = useSWR(
    `/api/v1/analytics/hourly?${params}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (!data || data.length === 0) {
    return (
      <div>
        <h3 className="text-body-strong mb-3">Activity by Hour (UTC)</h3>
        <p className="text-small text-text-tertiary py-4 text-center">
          No hourly data yet.
        </p>
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: formatHour(d.hour),
  }));

  return (
    <div>
      <h3 className="text-body-strong mb-3">Activity by Hour (UTC)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#E5E7EB" }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#E5E7EB" }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                fontSize: 13,
                borderRadius: 8,
                border: "1px solid #E5E7EB",
              }}
            />
            <Bar dataKey="views" fill="#4F46E5" name="Views" radius={[2, 2, 0, 0]} />
            <Bar dataKey="clicks" fill="#059669" name="Clicks" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
