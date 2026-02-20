import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { checkFeature } from "@/lib/plan-gate";

export async function POST(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { allowed } = await checkFeature(auth.userId, "pro_analytics");
  if (!allowed) {
    return Response.json({ error: "Pro plan required" }, { status: 403 });
  }

  const body = await request.json();
  const pageId = body.page_id;
  const enabled = body.enabled;

  if (typeof pageId !== "string" || typeof enabled !== "boolean") {
    return Response.json({ error: "page_id (string) and enabled (boolean) required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Verify ownership
  const { data: page } = await supabase
    .from("pages")
    .select("id, integrations")
    .eq("id", pageId)
    .eq("user_id", auth.userId)
    .single();

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }

  const existing = (page.integrations ?? {}) as Record<string, unknown>;

  if (enabled) {
    const token = existing.analytics_share_token ?? crypto.randomUUID();
    const { error } = await supabase
      .from("pages")
      .update({ integrations: { ...existing, analytics_share_token: token } })
      .eq("id", pageId);
    if (error) {
      return Response.json({ error: "Failed to enable sharing" }, { status: 500 });
    }
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so";
    return Response.json({ data: { token, share_url: `https://${appDomain}/analytics/${token}` } });
  } else {
    const { analytics_share_token: _, ...rest } = existing;
    const { error } = await supabase
      .from("pages")
      .update({ integrations: Object.keys(rest).length > 0 ? rest : null })
      .eq("id", pageId);
    if (error) {
      return Response.json({ error: "Failed to disable sharing" }, { status: 500 });
    }
    return Response.json({ data: { token: null, share_url: null } });
  }
}
