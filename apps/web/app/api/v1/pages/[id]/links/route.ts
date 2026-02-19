import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { createLinkSchema } from "@portalo/shared";
import { checkLinkLimit } from "@/lib/plan-gate";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { id } = await params;
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
    .select("*")
    .eq("page_id", id)
    .order("position", { ascending: true });

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ data });
}

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { error: { code: "invalid_json", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = createLinkSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = await params;
  const supabase = await createClient();

  // Verify page belongs to user and get plan
  const { data: page } = await supabase
    .from("pages")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (!page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  // Check plan link limit
  const gate = await checkLinkLimit(auth.userId, id);
  if (!gate.allowed) {
    return Response.json(
      {
        error: {
          code: "plan_limit",
          message: `Your ${gate.plan} plan allows ${gate.limit} links per page. Upgrade to add more.`,
        },
      },
      { status: 403 }
    );
  }

  // Auto-assign position to end of list
  const position = parsed.data.position ?? gate.current;

  const { data, error } = await supabase
    .from("links")
    .insert({ ...parsed.data, page_id: id, position })
    .select()
    .single();

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ data }, { status: 201 });
}
