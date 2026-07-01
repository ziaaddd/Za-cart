import Stripe from "npm:stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { items, shippingData, discount, coupon, origin } = body as {
      items: Array<{
        id: number;
        name: string;
        image: string;
        price: number;
        quantity: number;
      }>;
      shippingData: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
        notes?: string;
      };
      discount: number;
      coupon: string | null;
      origin: string;
    };

    if (!items?.length) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        price_data: {
          currency: "egp",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }),
    );

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];

    if (discount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: "egp",
        name: coupon ?? "Discount",
        max_redemptions: 1,
        duration: "once",
      });
      discounts = [{ coupon: stripeCoupon.id }];
    }

    const metadata: Record<string, string> = {
      userId: user.id,
      userEmail: user.email ?? "",
      shippingData: JSON.stringify(shippingData),
      orderItems: JSON.stringify(
        items.map((i) => ({
          product_id: i.id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
      ),
      discount: String(discount),
      coupon: coupon ?? "",
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      discounts: discounts.length ? discounts : undefined,
      mode: "payment",

      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,

      customer_email: user.email ?? undefined,

      metadata,

      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    console.error("[create-checkout-session] Error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
