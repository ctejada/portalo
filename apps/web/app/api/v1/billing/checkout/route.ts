import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const body = await request.json();
  const plan = body.plan as string;

  if (!plan || !STRIPE_PRICE_IDS[plan]) {
    return Response.json(
      { error: { code: "bad_request", message: "Invalid plan" } },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", auth.userId)
    .single();

  const { data: { user } } = await supabase.auth.getUser();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: STRIPE_PRICE_IDS[plan], quantity: 1 }],
    customer: profile?.stripe_customer_id || undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user?.email || undefined,
    metadata: { user_id: auth.userId, plan },
    success_url: `${request.nextUrl.origin}/dashboard/settings/billing?success=true`,
    cancel_url: `${request.nextUrl.origin}/dashboard/settings/billing?canceled=true`,
  });

  return Response.json({ data: { url: session.url } });
}
