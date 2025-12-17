// backend/src/services/billing/stripeWebhook.service.js
import { supabase } from "../../config/supabase.js";
import { PLANS } from "../../config/plans.js";
import { env } from "../../config/env.js";

const PRICE_TO_PLAN = {
  [env.STRIPE_PRICE_STARTER]: "STARTER",
  [env.STRIPE_PRICE_PRO]: "PRO",
};

export async function handleStripeEvent(event) {

  // 1️⃣ Idempotency check – OK
  const { data: existing, error: existingErr } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();

  if (existing) {
    return;
  }

  // 2️⃣ Insert event ID – MUST throw on failure
  const { error: insertErr } = await supabase
    .from("stripe_events")
    .insert({ id: event.id });

  if (insertErr) {
    console.error("❌ Failed to insert stripe_events:", insertErr);
    throw insertErr; // ⭐ CRITICAL FIX – Stripe will retry
  }

  // 3️⃣ Handle event
  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object;
      const { userId, priceId } = session.metadata;

      const plan = PRICE_TO_PLAN[priceId];
      if (!plan) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          subscription_status: "active",
          plan,
          generation_limit: PLANS[plan].limit,
          generations_used: 0,
          usage_reset_at: getNextResetDate(plan),
        })
        .eq("user_id", userId);

      if (error) throw error; // ⭐ ensure Stripe retries if DB fails
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;
      if (!userId) return;

      const priceId = subscription.items.data[0].price.id;
      const plan = PRICE_TO_PLAN[priceId];
      if (!plan) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          plan,
          generation_limit: PLANS[plan].limit,
          subscription_status: subscription.status,
        })
        .eq("user_id", userId);

      if (error) throw error;
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;
      if (!userId) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: "canceled",
          plan: "FREE",
          generation_limit: PLANS.FREE.limit,
          generations_used: 0, 
          usage_reset_at: getNextResetDate("FREE"),
        })
        .eq("user_id", userId);

      if (error) throw error;
      break;
    }
  }
}

function getNextResetDate(plan) {
  const now = new Date();
  return plan === "FREE"
    ? new Date(now.getTime() + 24 * 60 * 60 * 1000)
    : new Date(now.setMonth(now.getMonth() + 1));
}
