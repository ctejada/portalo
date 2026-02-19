import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { getSupabaseClient } from "@/lib/supabase/api-client";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  // Verify ownership through page
  const { data: domain } = await supabase
    .from("domains")
    .select("id, pages!inner(user_id)")
    .eq("id", id)
    .eq("pages.user_id", auth.userId)
    .single();

  if (!domain) {
    return Response.json(
      { error: { code: "not_found", message: "Domain not found" } },
      { status: 404 }
    );
  }

  const { error } = await supabase.from("domains").delete().eq("id", id);

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return new Response(null, { status: 204 });
}
