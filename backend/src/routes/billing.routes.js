// backend/src/routes/billing.routes.js
import { Router } from "express";
import Stripe from "stripe";
import { authMiddleware } from "../middleware/auth.js";
import { env } from "../config/env.js";
import { supabase } from "../config/supabase.js";

const router = Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

router.post("/portal", authMiddleware, async (req, res) => {
  // 1️⃣ Get user's Stripe customer id
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", req.user.id)
    .single();

  if (error || !profile?.stripe_customer_id) {
    return res.status(400).json({ error: "No active subscription" });
  }

  // 2️⃣ Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${env.FRONTEND_URL}/pricing`,
  });

  // 3️⃣ Redirect URL
  res.json({ url: session.url });
});

export default router;
