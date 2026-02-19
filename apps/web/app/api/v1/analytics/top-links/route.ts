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
  const since = new Date();
  since.setDate(since.getDate() - days);

  // Get click events grouped by link_id
  const { data: events } = await supabase
    .from("analytics_events")
    .select("link_id")
    .in("page_id", pageIds)
    .eq("event_type", "click")
    .not("link_id", "is", null)
    .gte("created_at", since.toISOString());

  // Count clicks per link
  const clickCounts: Record<string, number> = {};
  for (const e of events ?? []) {
    if (e.link_id) {
      clickCounts[e.link_id] = (clickCounts[e.link_id] || 0) + 1;
    }
  }

  // Get top 10 link IDs by clicks
  const topLinkIds = Object.entries(clickCounts)
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
      return { id, title: link.title, url: link.url, clicks: clickCounts[id] };
    })
    .filter(Boolean);

  return Response.json({ data });
}
