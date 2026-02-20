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
    return Response.json({ data: [] });
  }

  const days = period === "90d" ? 90 : period === "30d" ? 30 : 7;
  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - days);
  const prevSince = new Date(since);
  prevSince.setDate(prevSince.getDate() - days);

  // Get click events for current AND previous period
  const { data: events } = await supabase
    .from("analytics_events")
    .select("link_id, created_at")
    .in("page_id", pageIds)
    .eq("event_type", "click")
    .not("link_id", "is", null)
    .gte("created_at", prevSince.toISOString());

  // Count clicks per link for current and previous periods
  const currentCounts: Record<string, number> = {};
  const prevCounts: Record<string, number> = {};
  const sinceTs = since.getTime();

  for (const e of events ?? []) {
    if (!e.link_id) continue;
    const ts = new Date(e.created_at).getTime();
    if (ts >= sinceTs) {
      currentCounts[e.link_id] = (currentCounts[e.link_id] || 0) + 1;
    } else {
      prevCounts[e.link_id] = (prevCounts[e.link_id] || 0) + 1;
    }
  }

  // Get top 10 link IDs by current period clicks
  const topLinkIds = Object.entries(currentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  if (topLinkIds.length === 0) {
    return Response.json({ data: [] });
  }

  // Fetch link details
  const { data: links } = await supabase
    .from("links")
    .select("id, title, url")
    .in("id", topLinkIds);

  const linkMap = new Map((links ?? []).map((l) => [l.id, l]));
  const data = topLinkIds
    .map((id) => {
      const link = linkMap.get(id);
      if (!link) return null;
      const current = currentCounts[id] || 0;
      const prev = prevCounts[id] || 0;
      // Velocity: percentage change from previous period
      const velocity_pct = prev > 0
        ? Math.round(((current - prev) / prev) * 100)
        : current > 0 ? 100 : 0;
      return { id, title: link.title, url: link.url, clicks: current, velocity_pct };
    })
    .filter(Boolean);

  return Response.json({ data });
}
