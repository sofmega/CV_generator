// backend/src/routes/payments.routes.js
import express from "express";
import Stripe from "stripe";
import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js";
import { authMiddleware } from "../middleware/auth.js";
import { logger } from "../config/logger.js";

const router = express.Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const ALLOWED_PRICE_IDS = new Set([
  "price_1Sc6euLPQul2TqUGUBDjs9de",
  "price_1Sc6fcLPQul2TqUGKIlyWCGN",
]);

// Protected — Create Checkout Session
router.post("/create-checkout-session", authMiddleware, async (req, res, next) => {
  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    if (!ALLOWED_PRICE_IDS.has(priceId)) {
      return res.status(400).json({ error: "Invalid priceId" });
    }

    const userId = req.user.id;
    const email = req.user.email;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.FRONTEND_URL}/payment-success`,
      cancel_url: `${env.FRONTEND_URL}/pricing`,
      metadata: { userId, priceId },
      subscription_data: {
        metadata: { userId, priceId },
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    logger.error({ err }, "Stripe checkout error");
    next(err);
  }
});

// ------------------------
// Stripe Webhook
// ------------------------
router.post("/webhook", async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error({ err }, "Stripe webhook signature error");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const priceId = session.metadata.priceId;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            plan_id: priceId,
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
            plan_id: null,
          })
          .eq("user_id", userId);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    logger.error({ err }, "Stripe webhook processing failed");
    return res.status(500).send("Server Error");
  }

  return res.json({ received: true });
});

export default router;
