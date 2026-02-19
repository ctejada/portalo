import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { getSupabaseClient } from "@/lib/supabase/api-client";
import { updateLinkSchema } from "@portalo/shared";
import { invalidatePageCache } from "@/lib/cache";
import { detectPlatform } from "@/lib/platform-detect";

type Params = { params: Promise<{ id: string; linkId: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { error: { code: "invalid_json", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = updateLinkSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id, linkId } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  // Verify page belongs to user
  const { data: page } = await supabase
    .from("pages")
    .select("id, slug")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (!page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  // Re-detect platform if URL changed and platform not explicitly set
  if (parsed.data.url && parsed.data.platform === undefined) {
    parsed.data.platform = detectPlatform(parsed.data.url);
  }

  const { data, error } = await supabase
    .from("links")
    .update(parsed.data)
    .eq("id", linkId)
    .eq("page_id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return Response.json(
        { error: { code: "not_found", message: "Link not found" } },
        { status: 404 }
      );
    }
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  invalidatePageCache(page.slug).catch(() => {});

  return Response.json({ data });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { id, linkId } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  // Verify page belongs to user
  const { data: page } = await supabase
    .from("pages")
    .select("id, slug")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (!page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", linkId)
    .eq("page_id", id);

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  invalidatePageCache(page.slug).catch(() => {});

  return new Response(null, { status: 204 });
}
