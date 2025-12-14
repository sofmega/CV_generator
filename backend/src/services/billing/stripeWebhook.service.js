// services/billing/stripeWebhook.service.js
import { supabase } from "../../config/supabase.js";
import { PLANS } from "../../config/plans.js";

const PRICE_TO_PLAN = {
  price_1Sc6euLPQul2TqUGUBDjs9de: "STARTER",
  price_1Sc6fcLPQul2TqUGKIlyWCGN: "PRO",
};

export async function handleStripeEvent(event) {
  // 1️⃣ Check if already processed
  const { data: existing } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .single();

  if (existing) return;

  // 2️⃣ Insert event id (idempotency guard)
  const { error: insertError } = await supabase
    .from("stripe_events")
    .insert({ id: event.id });

  if (insertError) return;

  // 3️⃣ Handle event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { userId, priceId } = session.metadata;

      const plan = PRICE_TO_PLAN[priceId];
      if (!plan) return;

      await supabase
        .from("profiles")
        .update({
          subscription_status: "active",
          plan,
          generation_limit: PLANS[plan].limit,
          generations_used: 0,
          usage_reset_at: getNextResetDate(plan),
        })
        .eq("user_id", userId);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;

      await supabase
        .from("profiles")
        .update({
          subscription_status: "canceled",
          plan: "FREE",
          generation_limit: PLANS.FREE.limit,
        })
        .eq("user_id", userId);

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
