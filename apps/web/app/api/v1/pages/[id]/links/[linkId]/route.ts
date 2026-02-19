import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { updateLinkSchema } from "@portalo/shared";

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
  const supabase = await createClient();

  // Verify page belongs to user
  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (!page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
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

  return Response.json({ data });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { id, linkId } = await params;
  const supabase = await createClient();

  // Verify page belongs to user
  const { data: page } = await supabase
    .from("pages")
    .select("id")
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

  return new Response(null, { status: 204 });
}
