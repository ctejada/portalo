import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { getSupabaseClient } from "@/lib/supabase/api-client";
import { pageLayoutSchema } from "@portalo/shared";
import { invalidatePageCache } from "@/lib/cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);
  const { data, error } = await supabase
    .from("pages")
    .select("layout")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (error || !data) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  return Response.json({ data: data.layout });
}

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

  const parsed = pageLayoutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Validate: every block section references an existing block
  for (const section of parsed.data.sections) {
    if (section.type === "block" && section.id) {
      if (!parsed.data.blocks.some((b) => b.id === section.id)) {
        return Response.json(
          { error: { code: "invalid_layout", message: `Block section references missing block: ${section.id}` } },
          { status: 400 }
        );
      }
    }
  }

  const { id } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  const { data: page, error: findError } = await supabase
    .from("pages")
    .select("id, slug")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (findError || !page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("pages")
    .update({ layout: parsed.data })
    .eq("id", id)
    .eq("user_id", auth.userId)
    .select("layout")
    .single();

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  invalidatePageCache(page.slug).catch(() => {});

  return Response.json({ data: data.layout });
}
