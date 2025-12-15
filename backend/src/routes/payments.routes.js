// backend/src/routes/payments.routes.js
import { Router } from "express";
import Stripe from "stripe";
import { authMiddleware } from "../middleware/auth.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const router = Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

router.post(
  "/create-checkout-session",
  authMiddleware,
  async (req, res) => {
    try {
      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: "Missing priceId" });
      }

      const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  payment_method_types: ["card"],
  line_items: [
    {
      price: priceId,
      quantity: 1,
    },
  ],
  success_url: `${env.FRONTEND_URL}/success`,
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


      // 🔥 THIS LINE FIXES THE 504
      return res.json({ url: session.url });
    } catch (err) {
      logger.error({ err }, "Failed to create Stripe checkout session");
      return res.status(500).json({ error: "Unable to start payment" });
    }
  }
);

export default router;
