// backend/src/middleware/usageLimiter.js
import { supabase } from "../config/supabase.js";
import { PLANS } from "../config/plans.js";

/**
 * Enforces AI generation usage limits per user.
 */
export async function usageLimiter(req, res, next) {
  const userId = req.user.id;

  // Fetch full subscription state (we added subscription_status)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "plan, subscription_status, generations_used, generation_limit, usage_reset_at"
    )
    .eq("user_id", userId)
    .single();

  if (error || !profile) {
    return res.status(403).json({ error: "Profile not found" });
  }

  const now = new Date();

  // ------------------------------------------------
  // ⭐ 0️⃣ Payment Status Enforcement (CRITICAL FIX)
  // ------------------------------------------------
  // If user is on a paid plan but subscription is not ACTIVE:
  // - Stripe says payment failed / overdue / card declined / canceled
  // → Treat user as FREE until they update their payment method.
  if (profile.plan !== "FREE" && profile.subscription_status !== "active") {
    return res.status(402).json({
      error: "Your payment could not be processed. Please update your card.",
      code: "PAYMENT_REQUIRED",
      subscription_status: profile.subscription_status,
      plan: profile.plan,
      info: "Subscription is not active.",
      upgradeRequired: true,
    });
  }

  // ------------------------------------------------
  // 1️⃣ Reset quota if needed
  // ------------------------------------------------
  if (!profile.usage_reset_at || now > new Date(profile.usage_reset_at)) {
    const resetInterval =
      profile.plan === "FREE" ? "daily" : "monthly";

    const nextReset =
      resetInterval === "daily"
        ? new Date(now.getTime() + 24 * 60 * 60 * 1000)
        : new Date(now.setMonth(now.getMonth() + 1));

    const limit = PLANS[profile.plan]?.limit ?? 5;

    await supabase
      .from("profiles")
      .update({
        generations_used: 0,
        generation_limit: limit,
        usage_reset_at: nextReset.toISOString(),
      })
      .eq("user_id", userId);

    profile.generations_used = 0;
    profile.generation_limit = limit;
  }

  // ------------------------------------------------
  // 2️⃣ Block if limit reached
  // ------------------------------------------------
  if (profile.generations_used >= profile.generation_limit) {
    return res.status(402).json({
      error: "Generation limit reached",
      plan: profile.plan,
      upgradeRequired: profile.plan !== "PRO",
      resetAt: profile.usage_reset_at,
    });
  }

  // ------------------------------------------------
  // 3️⃣ Increment usage
  // ------------------------------------------------
  await supabase
    .from("profiles")
    .update({
      generations_used: profile.generations_used + 1,
    })
    .eq("user_id", userId);

  next();
}
