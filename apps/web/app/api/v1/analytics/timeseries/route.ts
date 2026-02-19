import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { analyticsQuerySchema } from "@portalo/shared";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const url = new URL(request.url);
  const parsed = analyticsQuerySchema.safeParse({
    page_id: url.searchParams.get("page_id"),
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

  // Verify page belongs to user
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

  const days = period === "90d" ? 90 : period === "30d" ? 30 : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, created_at")
    .eq("page_id", page_id)
    .gte("created_at", since.toISOString());

  // Build day-by-day buckets
  const buckets: Record<string, { views: number; clicks: number; email_captures: number }> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
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
