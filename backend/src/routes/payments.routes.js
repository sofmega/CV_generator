// routes/payments.routes.js
router.post(
  "/create-checkout-session",
  authMiddleware,
  async (req, res, next) => {
    // ONLY checkout logic
  }
);
