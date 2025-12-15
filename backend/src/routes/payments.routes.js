// backend/src/routes/payments.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = Router(); 

router.post(
  "/create-checkout-session",
  authMiddleware,
  async (req, res) => {
    // checkout logic
  }
);

export default router;
