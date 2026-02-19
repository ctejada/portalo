import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;

  const { data: page, error: pageError } = await supabaseAdmin
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (pageError || !page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  const { data: links, error: linksError } = await supabaseAdmin
    .from("links")
    .select("*")
    .eq("page_id", page.id)
    .eq("visible", true)
    .order("position", { ascending: true });

  if (linksError) {
    return Response.json(
      { error: { code: "db_error", message: linksError.message } },
      { status: 500 }
    );
  }

  const now = new Date().toISOString();
  const activeLinks = (links ?? []).filter((link) => {
    if (link.schedule_start && link.schedule_start > now) return false;
    if (link.schedule_end && link.schedule_end < now) return false;
    return true;
  });

  return Response.json({ data: { ...page, links: activeLinks } });
}
