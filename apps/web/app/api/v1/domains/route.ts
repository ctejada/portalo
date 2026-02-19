import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { createDomainSchema, PLANS } from "@portalo/shared";
import type { Plan } from "@portalo/shared";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("domains")
    .select("*, pages!inner(user_id)")
    .eq("pages.user_id", auth.userId);

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ data });
}

export async function POST(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { error: { code: "invalid_json", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = createDomainSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();

  // Verify page belongs to user
  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("id", parsed.data.page_id)
    .eq("user_id", auth.userId)
    .single();

  if (!page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  // Check plan domain limit
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", auth.userId)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;
  const limit = PLANS[plan].limits.custom_domains;

  const { count } = await supabase
    .from("domains")
    .select("id", { count: "exact", head: true })
    .eq("page_id", parsed.data.page_id);

  if ((count ?? 0) >= limit) {
    return Response.json(
      {
        error: {
          code: "plan_limit",
          message: `Your ${plan} plan allows ${limit} custom domain${limit === 1 ? "" : "s"}.`,
        },
      },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("domains")
    .insert({
      domain: parsed.data.domain.toLowerCase(),
      page_id: parsed.data.page_id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: { code: "domain_taken", message: "This domain is already registered" } },
        { status: 409 }
      );
    }
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ data }, { status: 201 });
}
