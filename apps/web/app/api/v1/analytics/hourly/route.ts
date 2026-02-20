import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { parseAnalyticsParams } from "@/lib/analytics-params";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const result = await parseAnalyticsParams(request, auth.userId);
  if (result.error) return result.error;
  const { pageIds, since } = result.params!;

  // Initialize 24-hour buckets
  const buckets = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    views: 0,
    clicks: 0,
  }));

  if (pageIds.length === 0) {
    return Response.json({ data: buckets });
  }

  const supabase = await createClient();

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
