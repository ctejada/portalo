import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { updatePageSchema } from "@portalo/shared";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (error || !data) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  return Response.json({ data });
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

  const parsed = updatePageSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", auth.userId)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: { code: "slug_taken", message: "This slug is already taken" } },
        { status: 409 }
      );
    }
    if (error.code === "PGRST116") {
      return Response.json(
        { error: { code: "not_found", message: "Page not found" } },
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

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return new Response(null, { status: 204 });
}
