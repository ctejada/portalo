import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { getSupabaseClient } from "@/lib/supabase/api-client";
import dns from "dns/promises";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  // Get domain and verify ownership
  const { data: domain } = await supabase
    .from("domains")
    .select("*, pages!inner(user_id)")
    .eq("id", id)
    .eq("pages.user_id", auth.userId)
    .single();

  if (!domain) {
    return Response.json(
      { error: { code: "not_found", message: "Domain not found" } },
      { status: 404 }
    );
  }

  // Check DNS CNAME record
  let verified = false;
  try {
    const records = await dns.resolveCname(domain.domain);
    // Accept if CNAME points to our app domain
    verified = records.some(
      (r) => r.endsWith(".vercel.app") || r.endsWith(".portalo.so")
    );
  } catch {
    // DNS lookup failed — domain not verified
  }

  const updates: Record<string, unknown> = {
    verified,
    ssl_status: verified ? "active" : "pending",
  };

  const { data, error } = await supabase
    .from("domains")
    .update(updates)
    .eq("id", id)
    .select("id, domain, verified, ssl_status, created_at, updated_at")
    .single();

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ data });
}
