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

  // Initialize 24-hour buckets
  const buckets = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    views: 0,
    clicks: 0,
  }));

  if (pageIds.length === 0) {
    return Response.json({ data: buckets });
  }

  const days = period === "90d" ? 90 : period === "30d" ? 30 : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, created_at")
    .in("page_id", pageIds)
    .gte("created_at", since.toISOString());

  for (const e of events ?? []) {
    const hour = new Date(e.created_at).getUTCHours();
    if (e.event_type === "view") buckets[hour].views++;
    else if (e.event_type === "click") buckets[hour].clicks++;
  }

  return Response.json({ data: buckets });
}
