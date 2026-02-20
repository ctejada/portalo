import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { parseAnalyticsParams } from "@/lib/analytics-params";
import { checkFeature } from "@/lib/plan-gate";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const result = await parseAnalyticsParams(request, auth.userId);
  if (result.error) return result.error;
  const { pageIds, since, days } = result.params!;

  if (pageIds.length === 0) {
    return Response.json({
      data: { views: 0, clicks: 0, unique_views: 0, unique_clicks: 0, ctr: 0, bounce_rate: 0, avg_time_to_click_ms: null, email_captures: 0, top_referrer: null, top_country: null, period_days: days, new_visitors: null, returning_visitors: null },
    });
  }

  const supabase = await createClient();

  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, referrer, country, visitor_id, time_to_click_ms")
    .in("page_id", pageIds)
    .gte("created_at", since.toISOString());

  const rows = events ?? [];
  const views = rows.filter((e) => e.event_type === "view").length;
  const clicks = rows.filter((e) => e.event_type === "click").length;
  const emailCaptures = rows.filter((e) => e.event_type === "email_capture").length;
  const ctr = views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0;

  // Unique views/clicks by distinct visitor_id
  const viewVisitors = new Set(rows.filter((e) => e.event_type === "view" && e.visitor_id).map((e) => e.visitor_id));
  const clickVisitors = new Set(rows.filter((e) => e.event_type === "click" && e.visitor_id).map((e) => e.visitor_id));
  const uniqueViews = viewVisitors.size || views;
  const uniqueClicks = clickVisitors.size || clicks;

  // Bounce rate: viewers who never clicked (using visitor_id when available)
  const bounceRate = viewVisitors.size > 0
    ? Math.round(((viewVisitors.size - clickVisitors.size) / viewVisitors.size) * 1000) / 10
    : views > 0
      ? Math.round(((views - clicks) / views) * 1000) / 10
      : 0;

  // Average time-to-click
  const timings = rows
    .filter((e) => e.time_to_click_ms != null)
    .map((e) => e.time_to_click_ms as number);
  const avgTimeToClick = timings.length > 0
    ? Math.round(timings.reduce((sum, t) => sum + t, 0) / timings.length)
    : null;

  // Top referrer
  const refCounts: Record<string, number> = {};
  for (const e of rows) {
    if (e.referrer) refCounts[e.referrer] = (refCounts[e.referrer] || 0) + 1;
  }
  const topReferrer = Object.entries(refCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Top country
  const countryCounts: Record<string, number> = {};
  for (const e of rows) {
    if (e.country) countryCounts[e.country] = (countryCounts[e.country] || 0) + 1;
  }
  const topCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Returning vs new visitor classification (Pro only)
  let newVisitors: number | null = null;
  let returningVisitors: number | null = null;

  const { allowed: hasPro } = await checkFeature(auth.userId, "pro_analytics");
  if (hasPro && viewVisitors.size > 0) {
    const visitorIds = Array.from(viewVisitors);
    const { data: priorEvents } = await supabase
      .from("analytics_events")
      .select("visitor_id")
      .in("page_id", pageIds)
      .in("visitor_id", visitorIds)
      .lt("created_at", since.toISOString())
      .eq("event_type", "view");

    const returningSet = new Set((priorEvents ?? []).map((e) => e.visitor_id));
    returningVisitors = returningSet.size;
    newVisitors = viewVisitors.size - returningSet.size;
  }

  return Response.json({
    data: {
      views,
      clicks,
      unique_views: uniqueViews,
      unique_clicks: uniqueClicks,
      ctr,
      bounce_rate: Math.max(0, bounceRate),
      avg_time_to_click_ms: avgTimeToClick,
      email_captures: emailCaptures,
      top_referrer: topReferrer,
      top_country: topCountry,
      period_days: days,
      new_visitors: newVisitors,
      returning_visitors: returningVisitors,
    },
  });
}
