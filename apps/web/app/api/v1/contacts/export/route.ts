import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const pageId = new URL(request.url).searchParams.get("page_id");
  if (!pageId) {
    return Response.json(
      { error: { code: "missing_param", message: "page_id is required" } },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("id", pageId)
    .eq("user_id", auth.userId)
    .single();

  if (!page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("email, source, created_at")
    .eq("page_id", pageId)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  const rows = (contacts ?? []).map((c) => [
    `"${c.email}"`,
    `"${c.source || ""}"`,
    `"${new Date(c.created_at).toISOString().split("T")[0]}"`,
  ]);

  const csv = ["email,source,captured_date", ...rows.map((r) => r.join(","))].join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="contacts-${date}.csv"`,
    },
  });
}
