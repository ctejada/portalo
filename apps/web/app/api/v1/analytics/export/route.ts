import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { checkFeature } from "@/lib/plan-gate";
import { createClient } from "@/lib/supabase/server";
import { analyticsExportSchema } from "@portalo/shared";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  // Pro gate
  const gate = await checkFeature(auth.userId, "pro_analytics");
  if (!gate.allowed) {
    return Response.json(
      { error: { code: "upgrade_required", message: "CSV export requires Pro plan" } },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const parsed = analyticsExportSchema.safeParse({
    page_id: url.searchParams.get("page_id") || undefined,
    period: url.searchParams.get("period") ?? "7d",
    start_date: url.searchParams.get("start_date") || undefined,
    end_date: url.searchParams.get("end_date") || undefined,
  });

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { page_id, period, start_date, end_date } = parsed.data;
  const supabase = await createClient();

  // Verify ownership
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

  // Determine date range
  let since: Date;
  let until: Date;
  if (start_date && end_date) {
    since = new Date(start_date + "T00:00:00Z");
    until = new Date(end_date + "T23:59:59Z");
  } else {
    const days = period === "90d" ? 90 : period === "30d" ? 30 : 7;
    until = new Date();
    since = new Date();
    since.setDate(since.getDate() - days);
  }

  // Fetch events in range (limit to 10000 rows)
  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, link_id, referrer, country, device, browser, visitor_id, time_to_click_ms, created_at")
    .eq("page_id", page_id)
    .gte("created_at", since.toISOString())
    .lte("created_at", until.toISOString())
    .order("created_at", { ascending: true })
    .limit(10000);

  // Build CSV
  const headers = ["timestamp", "event_type", "link_id", "referrer", "country", "device", "browser", "visitor_id", "time_to_click_ms"];
  const rows = (events ?? []).map((e) =>
    [
      e.created_at,
      e.event_type,
      e.link_id ?? "",
      csvEscape(e.referrer ?? ""),
      e.country ?? "",
      e.device ?? "",
      e.browser ?? "",
      e.visitor_id ?? "",
      e.time_to_click_ms ?? "",
    ].join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const dateStr = new Date().toISOString().split("T")[0];

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="analytics-${page_id.slice(0, 8)}-${dateStr}.csv"`,
    },
  });
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
