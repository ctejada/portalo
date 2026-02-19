import { supabaseAdmin } from "@/lib/supabase/admin";
import { PLANS } from "@portalo/shared";
import type { Plan } from "@portalo/shared";

interface GateResult {
  allowed: boolean;
  plan: Plan;
  limit: number;
  current: number;
}

export async function checkPageLimit(userId: string): Promise<GateResult> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;
  const limit = PLANS[plan].limits.pages;

  const { count } = await supabaseAdmin
    .from("pages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const current = count ?? 0;
  return { allowed: current < limit, plan, limit, current };
}

export async function checkLinkLimit(
  userId: string,
  pageId: string
): Promise<GateResult> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;
  const limit = PLANS[plan].limits.links_per_page;

  const { count } = await supabaseAdmin
    .from("links")
    .select("id", { count: "exact", head: true })
    .eq("page_id", pageId);

  const current = count ?? 0;
  return { allowed: current < limit, plan, limit, current };
}

export async function checkFeature(
  userId: string,
  feature: keyof typeof PLANS.free.limits
): Promise<{ allowed: boolean; plan: Plan }> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;
  const value = PLANS[plan].limits[feature];
  return { allowed: Boolean(value), plan };
}
