import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Analytics — Portalo",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function SharedAnalyticsPage({ params }: Props) {
  const { token } = await params;

  // Look up page by share token
  const { data: page } = await supabaseAdmin
    .from("pages")
    .select("id, title, slug")
    .eq("integrations->>analytics_share_token", token)
    .single();

  if (!page) notFound();

  // Fetch last 30 days of analytics
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: events } = await supabaseAdmin
    .from("analytics_events")
    .select("event_type, visitor_id")
    .eq("page_id", page.id)
    .gte("created_at", since.toISOString());

  const rows = events ?? [];
  const views = rows.filter((e) => e.event_type === "view").length;
  const clicks = rows.filter((e) => e.event_type === "click").length;
  const uniqueVisitors = new Set(rows.filter((e) => e.visitor_id).map((e) => e.visitor_id)).size;
  const ctr = views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0;

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-page-title text-text-primary mb-1">
          {page.title || page.slug}
        </h1>
        <p className="text-small text-text-tertiary mb-8">Last 30 days</p>

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Views" value={views} />
          <StatCard label="Clicks" value={clicks} />
          <StatCard label="Unique Visitors" value={uniqueVisitors} />
          <StatCard label="CTR" value={`${ctr}%`} />
        </div>

        <p className="text-tiny text-text-tertiary mt-8 text-center">
          Powered by Portalo
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-lg border border-border-primary">
      <p className="text-caption text-text-secondary mb-1">{label}</p>
      <p className="text-page-title text-text-primary">{String(value)}</p>
    </div>
  );
}
