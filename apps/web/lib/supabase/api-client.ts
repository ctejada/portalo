import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Returns the appropriate Supabase client based on auth method.
 * - API key auth: uses supabaseAdmin (bypasses RLS, since there's no session)
 * - Session auth: uses the cookie-based client (respects RLS via auth.uid())
 */
export async function getSupabaseClient(isApiKey: boolean) {
  return isApiKey ? supabaseAdmin : createClient();
}
