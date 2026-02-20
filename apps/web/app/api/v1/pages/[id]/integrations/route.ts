import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { getSupabaseClient } from "@/lib/supabase/api-client";
import { checkFeature } from "@/lib/plan-gate";
import { pageIntegrationsSchema } from "@portalo/shared";
import { invalidatePageCache } from "@/lib/cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  const { data, error } = await supabase
    .from("pages")
    .select("integrations, slug")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (error || !data) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  return Response.json({ data: data.integrations ?? {} });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const gate = await checkFeature(auth.userId, "pro_analytics");
  if (!gate.allowed) {
    return Response.json(
      { error: { code: "upgrade_required", message: "Integrations require Pro plan" } },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { error: { code: "invalid_json", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = pageIntegrationsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  // Fetch existing to merge
  const { data: existing } = await supabase
    .from("pages")
    .select("integrations, slug")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (!existing) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  const merged = {
    ...((existing.integrations as Record<string, unknown>) ?? {}),
    ...parsed.data,
  };

  const { data, error } = await supabase
    .from("pages")
    .update({ integrations: merged })
    .eq("id", id)
    .eq("user_id", auth.userId)
    .select()
    .single();

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  invalidatePageCache(existing.slug).catch(() => {});

  return Response.json({ data: data.integrations ?? {} });
}
