// backend/tests/webhooks/payments.webhook.test.js
import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { mockLogger } from "../test-utils/mockLogger.js";
import { mockStripe, mockCreateSession } from "../test-utils/mockStripe.js";

vi.mock("../../src/config/logger.js", () => ({
  logger: mockLogger,
}));

vi.mock("../../src/middleware/auth.js", () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id: "user123", email: "test@test.com" };
    next();
  },
}));

vi.mock("stripe", () => mockStripe);

vi.mock("../../src/config/supabase.js", () => ({
  supabase: {
    from: () => ({
      update: () => ({
        eq: () => ({ data: {}, error: null }),
      }),
    }),
  },
}));

let app;
beforeAll(async () => {
  app = (await import("../../src/app.js")).default;
});

describe("POST /payments/create-checkout-session", () => {
  it("should return 400 when priceId is missing", async () => {
    const res = await request(app)
      .post("/payments/create-checkout-session")
      .send({});

    expect(res.status).toBe(400);
  });

  it("should return 400 for invalid priceId", async () => {
    const res = await request(app)
      .post("/payments/create-checkout-session")
      .send({ priceId: "INVALID" });

    expect(res.status).toBe(400);
  });

  it("should return Stripe session URL on success", async () => {
    const res = await request(app)
      .post("/payments/create-checkout-session")
      .send({
        priceId: "price_1Sc6euLPQul2TqUGUBDjs9de",
      });

    expect(res.status).toBe(200);
    expect(res.body.url).toBe("https://stripe-session-url");
    expect(mockCreateSession).toHaveBeenCalledOnce();
  });
});
