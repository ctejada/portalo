import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { parseAnalyticsParams } from "@/lib/analytics-params";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const result = await parseAnalyticsParams(request, auth.userId);
  if (result.error) return result.error;
  const { pageIds, since, days } = result.params!;

  if (pageIds.length === 0) {
    const buckets: { date: string; views: number; clicks: number; email_captures: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      buckets.push({ date: d.toISOString().split("T")[0], views: 0, clicks: 0, email_captures: 0 });
    }
    return Response.json({ data: buckets });
  }

  const supabase = await createClient();

  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, created_at")
    .in("page_id", pageIds)
    .gte("created_at", since.toISOString());

  // Build day-by-day buckets
  const buckets: Record<string, { views: number; clicks: number; email_captures: number }> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    buckets[key] = { views: 0, clicks: 0, email_captures: 0 };
  }

  for (const e of events ?? []) {
    const key = new Date(e.created_at).toISOString().split("T")[0];
    if (!buckets[key]) continue;
    if (e.event_type === "view") buckets[key].views++;
    else if (e.event_type === "click") buckets[key].clicks++;
    else if (e.event_type === "email_capture") buckets[key].email_captures++;
  }

  const data = Object.entries(buckets).map(([date, counts]) => ({
    date,
    ...counts,
  }));

  return Response.json({ data });
}
