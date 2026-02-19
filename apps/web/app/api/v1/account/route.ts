import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, plan, created_at")
    .eq("id", auth.userId)
    .single();

  if (error || !profile) {
    return Response.json(
      { error: { code: "not_found", message: "Profile not found" } },
      { status: 404 }
    );
  }

  return Response.json({ data: profile });
}

export async function PUT(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const body = await request.json();
  const updates: Record<string, string> = {};

  if (typeof body.display_name === "string") {
    updates.display_name = body.display_name.trim().slice(0, 100);
  }

  if (Object.keys(updates).length === 0) {
    return Response.json(
      { error: { code: "bad_request", message: "No valid fields to update" } },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", auth.userId)
    .select("id, display_name, avatar_url, plan, created_at")
    .single();

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ data });
}
