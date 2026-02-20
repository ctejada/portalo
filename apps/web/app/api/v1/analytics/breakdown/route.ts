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

  if (pageIds.length === 0) {
    return Response.json({ data: { referrers: [], countries: [], browsers: [] } });
  }

  const supabase = await createClient();

  const { data: events } = await supabase
    .from("analytics_events")
    .select("referrer, country, browser")
    .in("page_id", pageIds)
    .gte("created_at", since.toISOString());

  const refCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  const browserCounts: Record<string, number> = {};

  for (const e of events ?? []) {
    const ref = e.referrer || "Direct";
    refCounts[ref] = (refCounts[ref] || 0) + 1;
    if (e.country) {
      countryCounts[e.country] = (countryCounts[e.country] || 0) + 1;
    }
    if (e.browser) {
      browserCounts[e.browser] = (browserCounts[e.browser] || 0) + 1;
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

  const browsers = Object.entries(browserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return Response.json({ data: { referrers, countries, browsers } });
}
