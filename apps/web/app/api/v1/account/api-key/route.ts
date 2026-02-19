import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  // Generate random API key
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const apiKey = `pk_${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;

  // Hash it with SHA-256 (matching api-auth.ts lookup)
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(apiKey));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ api_key_hash: hash })
    .eq("id", auth.userId);

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({
    data: { api_key: apiKey, created_at: new Date().toISOString() },
  });
}
