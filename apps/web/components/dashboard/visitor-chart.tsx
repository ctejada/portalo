"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface VisitorChartProps {
  newVisitors: number | null;
  returningVisitors: number | null;
}

const COLORS = ["var(--color-accent)", "var(--color-text-tertiary)"];

export function VisitorChart({ newVisitors, returningVisitors }: VisitorChartProps) {
  if (newVisitors == null || returningVisitors == null) return null;

  const total = newVisitors + returningVisitors;
  if (total === 0) {
    return (
      <p className="text-small text-text-tertiary">No visitor data yet.</p>
    );
  }

  const data = [
    { name: "New", value: newVisitors },
    { name: "Returning", value: returningVisitors },
  ];

  const newPct = Math.round((newVisitors / total) * 100);
  const retPct = 100 - newPct;

  return (
    <div className="flex items-center gap-6">
      <div className="w-28 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={48}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "6px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 text-small">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="text-text-primary">New {newPct}%</span>
          <span className="text-text-tertiary">({newVisitors})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-bg-tertiary" />
          <span className="text-text-primary">Returning {retPct}%</span>
          <span className="text-text-tertiary">({returningVisitors})</span>
        </div>
      </div>
    </div>
  );
}
