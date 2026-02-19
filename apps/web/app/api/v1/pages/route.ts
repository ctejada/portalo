import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { createPageSchema, PLANS } from "@portalo/shared";
import type { Plan } from "@portalo/shared";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false });

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

  const parsed = createPageSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Check plan page limit
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", auth.userId)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;
  const limit = PLANS[plan].limits.pages;

  const { count } = await supabase
    .from("pages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", auth.userId);

  if ((count ?? 0) >= limit) {
    return Response.json(
      {
        error: {
          code: "plan_limit",
          message: `Your ${plan} plan allows ${limit} page${limit === 1 ? "" : "s"}. Upgrade to create more.`,
        },
      },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("pages")
    .insert({ ...parsed.data, user_id: auth.userId })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: { code: "slug_taken", message: "This slug is already taken" } },
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
