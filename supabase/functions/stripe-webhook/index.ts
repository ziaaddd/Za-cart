import Stripe from "npm:stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
  httpClient: Stripe.createFetchHttpClient(),
});
insert;
// Service role client — bypasses RLS, only used server-side
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("[stripe-webhook] Missing stripe-signature header");
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    );
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return new Response(`Webhook signature error: ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (existingOrder) {
      console.log(
        `[stripe-webhook] Order already exists for session ${session.id}, skipping.`,
      );
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const metadata = session.metadata ?? {};
    const userId = metadata.userId;
    const shippingData = metadata.shippingData
      ? JSON.parse(metadata.shippingData)
      : null;
    const orderItemsRaw: Array<{
      product_id: number;
      name: string;
      image: string;
      price: number;
      quantity: number;
    }> = metadata.orderItems ? JSON.parse(metadata.orderItems) : [];
    const discount = parseFloat(metadata.discount ?? "0");

    if (!userId || !orderItemsRaw.length) {
      console.error(
        "[stripe-webhook] Missing userId or orderItems in metadata",
        metadata,
      );
      return new Response(JSON.stringify({ error: "Invalid metadata" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const totalPrice = session.amount_total
      ? session.amount_total / 100
      : orderItemsRaw.reduce((acc, i) => acc + i.price * i.quantity, 0) -
        discount;

    const { data: insertedOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        total_price: totalPrice,
        status: "confirmed",
        shipping_address: shippingData,
        stripe_session_id: session.id,
        payment_status: "paid",
      })
      .select()
      .single();

    if (orderError) {
      console.error("[stripe-webhook] Failed to insert order:", orderError);
      return new Response(JSON.stringify({ error: "DB insert failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const orderItems = orderItemsRaw.map((item) => ({
      order_id: insertedOrder.id,
      product_id: item.product_id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("orderItems")
      .insert(orderItems);

    if (itemsError) {
      console.error(
        "[stripe-webhook] Failed to insert order items:",
        itemsError,
      );
      await supabaseAdmin.from("orders").delete().eq("id", insertedOrder.id);
      return new Response(
        JSON.stringify({ error: "Order items insert failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const { error: cartError } = await supabaseAdmin
      .from("cart")
      .delete()
      .eq("user_id", userId);

    if (cartError) {
      console.warn(
        "[stripe-webhook] Failed to clear cart (non-fatal):",
        cartError,
      );
    }

    console.log(
      `[stripe-webhook] ✅ Order ${insertedOrder.id} created for user ${userId}`,
    );
  } else {
    console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
