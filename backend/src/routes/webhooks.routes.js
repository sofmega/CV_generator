  // backend/src/routes/webhooks.routes.js
  import express from "express";
  import Stripe from "stripe";
  import { env } from "../config/env.js";
  import { handleStripeEvent } from "../services/billing/stripeWebhook.service.js";
  import { logger } from "../config/logger.js";

  const router = express.Router();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  router.post("/stripe", async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error({ err }, "Invalid Stripe signature");
      return res.status(400).send("Invalid signature");
    }

    try {
      await handleStripeEvent(event);
      res.json({ received: true });
    } catch (err) {
      logger.error({ err }, "Stripe webhook handler failed");
      res.status(500).send("Webhook handler failed");
    }
  });

  export default router;
