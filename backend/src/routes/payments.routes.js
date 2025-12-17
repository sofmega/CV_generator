// backend/src/routes/payments.routes.js
import { Router } from "express";
import Stripe from "stripe";
import { authMiddleware } from "../middleware/auth.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const router = Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// ⭐ Only allow the legitimate production prices
const ALLOWED_PRICES = [
  env.STRIPE_PRICE_STARTER,
  env.STRIPE_PRICE_PRO,
];

router.post(
  "/create-checkout-session",
  authMiddleware,
  async (req, res) => {
    try {
      const { priceId } = req.body;

      // 1️⃣ PriceId must exist
      if (!priceId) {
        return res.status(400).json({ error: "Missing priceId" });
      }

      // 2️⃣ PriceId must be authorized (SECURITY FIX)
      if (!ALLOWED_PRICES.includes(priceId)) {
        return res.status(400).json({ error: "Invalid priceId" });
      }

      // 3️⃣ Create the Checkout Session
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.FRONTEND_URL}/pricing`,
        metadata: {
          userId: req.user.id,
          priceId,
        },
        subscription_data: {
          metadata: {
            userId: req.user.id,
          },
        },
      });

      return res.json({ url: session.url });
    } catch (err) {
      logger.error({ err }, "Failed to create Stripe checkout session");
      return res.status(500).json({ error: "Unable to start payment" });
    }
  }
);

export default router;
