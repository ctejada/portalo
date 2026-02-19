import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { createLinkSchema, PLANS } from "@portalo/shared";
import type { Plan } from "@portalo/shared";

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
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", auth.userId)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;
  const limit = PLANS[plan].limits.links_per_page;

  const { count } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("page_id", id);

  if ((count ?? 0) >= limit) {
    return Response.json(
      {
        error: {
          code: "plan_limit",
          message: `Your ${plan} plan allows ${limit} links per page. Upgrade to add more.`,
        },
      },
      { status: 403 }
    );
  }

  // Auto-assign position to end of list
  const position = parsed.data.position ?? (count ?? 0);

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
