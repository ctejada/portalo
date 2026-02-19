import { supabaseAdmin } from "@/lib/supabase/admin";
import { PLANS } from "@portalo/shared";
import type { Plan } from "@portalo/shared";

export async function checkRateLimit(userId: string): Promise<boolean> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("plan, api_calls_today, api_calls_reset_at")
    .eq("id", userId)
    .single();

  if (!profile) return false;

  const now = new Date();
  const resetAt = new Date(profile.api_calls_reset_at);

  // Reset counter if window has passed
  if (now > resetAt) {
    await supabaseAdmin
      .from("profiles")
      .update({
        api_calls_today: 1,
        api_calls_reset_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", userId);
    return true;
  }

  const plan = (profile.plan ?? "free") as Plan;
  const limit = PLANS[plan].limits.api_calls_per_day;

  if (profile.api_calls_today >= limit) {
    return false;
  }

  // Increment counter
  await supabaseAdmin
    .from("profiles")
    .update({ api_calls_today: profile.api_calls_today + 1 })
    .eq("id", userId);

  return true;
}
