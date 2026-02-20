import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { analyticsQuerySchema } from "@portalo/shared";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const url = new URL(request.url);
  const parsed = analyticsQuerySchema.safeParse({
    page_id: url.searchParams.get("page_id") || undefined,
    period: url.searchParams.get("period") ?? "7d",
  });

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page_id, period } = parsed.data;
  const supabase = await createClient();

  // Get page IDs to query
  let pageIds: string[];
  if (page_id) {
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", auth.userId)
      .single();
    if (!page) {
      return Response.json(
        { error: { code: "not_found", message: "Page not found" } },
        { status: 404 }
      );
    }
    pageIds = [page_id];
  } else {
    const { data: pages } = await supabase
      .from("pages")
      .select("id")
      .eq("user_id", auth.userId);
    pageIds = (pages ?? []).map((p) => p.id);
  }

  if (pageIds.length === 0) {
    return Response.json({
      data: { views: 0, clicks: 0, unique_views: 0, unique_clicks: 0, ctr: 0, email_captures: 0, top_referrer: null, top_country: null, period_days: 7 },
    });
  }

  const days = period === "90d" ? 90 : period === "30d" ? 30 : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, referrer, country, visitor_id")
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

  return Response.json({
    data: {
      views,
      clicks,
      unique_views: uniqueViews,
      unique_clicks: uniqueClicks,
      ctr,
      email_captures: emailCaptures,
      top_referrer: topReferrer,
      top_country: topCountry,
      period_days: days,
    },
  });
}
