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
    .select("referrer, country")
    .eq("page_id", page_id)
    .gte("created_at", since.toISOString());

  const refCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};

  for (const e of events ?? []) {
    const ref = e.referrer || "Direct";
    refCounts[ref] = (refCounts[ref] || 0) + 1;
    if (e.country) {
      countryCounts[e.country] = (countryCounts[e.country] || 0) + 1;
    }
  }

  const referrers = Object.entries(refCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const countries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return Response.json({ data: { referrers, countries } });
}
