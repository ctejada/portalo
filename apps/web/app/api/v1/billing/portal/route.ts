import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", auth.userId)
    .single();

  if (!profile?.stripe_customer_id) {
    return Response.json(
      { error: { code: "bad_request", message: "No billing account found" } },
      { status: 400 }
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${request.nextUrl.origin}/dashboard/settings/billing`,
  });

  return Response.json({ data: { url: session.url } });
}
