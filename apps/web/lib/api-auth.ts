import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { NextRequest } from "next/server";

interface AuthResult {
  userId: string;
  error?: never;
}

interface AuthError {
  userId?: never;
  error: Response;
}

/**
 * Extract authenticated user from an API request.
 * Supports two auth methods:
 * 1. Supabase session cookies (browser / dashboard)
 * 2. X-API-Key header (MCP server / programmatic access)
 */
export async function getApiUser(
  request: NextRequest
): Promise<AuthResult | AuthError> {
  // Check for API key first
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    return authenticateWithApiKey(apiKey);
  }

  // Fall back to session cookies
  return authenticateWithSession();
}

async function authenticateWithSession(): Promise<AuthResult | AuthError> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { userId: user.id };
}

async function authenticateWithApiKey(
  apiKey: string
): Promise<AuthResult | AuthError> {
  // Hash the provided key and look it up in profiles
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("api_key_hash", hash)
    .single();

  if (error || !profile) {
    return {
      error: Response.json({ error: "Invalid API key" }, { status: 401 }),
    };
  }

  return { userId: profile.id };
}
