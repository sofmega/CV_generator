// backend/src/routes/payments.routes.js
import express from "express";
import Stripe from "stripe";

import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js"; 

const router = express.Router();

// Stripe client with validated API key
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// -----------------------------------------------------------------------------
// Create Checkout Session
// -----------------------------------------------------------------------------
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId, userId, email } = req.body;

    if (!priceId || !userId || !email) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,

      line_items: [{ price: priceId, quantity: 1 }],

      success_url: `${env.FRONTEND_URL}/payment-success`,
      cancel_url: `${env.FRONTEND_URL}/pricing`,

      // Metadata stored → webhook uses it
      metadata: { userId, priceId },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// Stripe Webhook (raw body required → configured in app.js)
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
        // Ignore other events but acknowledge reception
        break;
    }
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return res.status(500).send("Server Error");
  }

  res.json({ received: true });
});

export default router;
