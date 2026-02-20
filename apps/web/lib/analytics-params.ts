import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkFeature } from "@/lib/plan-gate";
import { analyticsDateRangeQuerySchema } from "@portalo/shared";

export interface AnalyticsParams {
  pageIds: string[];
  since: Date;
  until: Date;
  days: number;
}

interface ParseResult {
  params?: AnalyticsParams;
  error?: Response;
}

export async function parseAnalyticsParams(
  request: NextRequest,
  userId: string
): Promise<ParseResult> {
  const url = new URL(request.url);
  const parsed = analyticsDateRangeQuerySchema.safeParse({
    page_id: url.searchParams.get("page_id") || undefined,
    period: url.searchParams.get("period") ?? "7d",
    start_date: url.searchParams.get("start_date") || undefined,
    end_date: url.searchParams.get("end_date") || undefined,
  });

  if (!parsed.success) {
    return { error: Response.json({ error: parsed.error.flatten() }, { status: 400 }) };
  }

  const { page_id, period, start_date, end_date } = parsed.data;

  // Pro gate for custom date ranges
  if (start_date || end_date) {
    const gate = await checkFeature(userId, "pro_analytics");
    if (!gate.allowed) {
      return {
        error: Response.json(
          { error: { code: "upgrade_required", message: "Custom date ranges require Pro plan" } },
          { status: 403 }
        ),
      };
    }
  }

  const supabase = await createClient();
  let pageIds: string[];

  if (page_id) {
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", userId)
      .single();
    if (!page) {
      return { error: Response.json({ error: { code: "not_found", message: "Page not found" } }, { status: 404 }) };
    }
    pageIds = [page_id];
  } else {
    const { data: pages } = await supabase
      .from("pages")
      .select("id")
      .eq("user_id", userId);
    pageIds = (pages ?? []).map((p) => p.id);
  }

  let since: Date;
  let until: Date;
  if (start_date && end_date) {
    since = new Date(start_date + "T00:00:00Z");
    until = new Date(end_date + "T23:59:59Z");
  } else {
    const d = period === "90d" ? 90 : period === "30d" ? 30 : 7;
    until = new Date();
    since = new Date();
    since.setDate(since.getDate() - d);
  }

  const days = Math.max(1, Math.ceil((until.getTime() - since.getTime()) / 86400000));

  return { params: { pageIds, since, until, days } };
}
