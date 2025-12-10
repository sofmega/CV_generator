// backend/src/routes/payments.routes.js
import express from "express";
import Stripe from "stripe";

import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Initialize Stripe using secure, validated environment variables
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// -----------------------------------------------------------------------------
// Protected: Create Checkout Session
// -----------------------------------------------------------------------------
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const { priceId } = req.body;

    // Only priceId should come from the frontend
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    // User identity must come from Supabase JWT, not the frontend
    const userId = req.user.id;
    const email = req.user.email;

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,

      line_items: [{ price: priceId, quantity: 1 }],

      success_url: `${env.FRONTEND_URL}/payment-success`,
      cancel_url: `${env.FRONTEND_URL}/pricing`,

      // Will be used later inside Stripe webhook
      metadata: { userId, priceId },
    });

    // Return checkout URL to the frontend
    return res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// Stripe Webhook (must use raw body in app.js)
// -----------------------------------------------------------------------------
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
    console.error("Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle Stripe event types
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
        // Ignore unhandled events but acknowledge receipt
        break;
    }
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return res.status(500).send("Server Error");
  }

  return res.json({ received: true });
});

export default router;
