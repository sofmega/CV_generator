import { vi } from "vitest";

export const mockCreateSession = vi.fn().mockResolvedValue({
  url: "https://stripe-session-url",
});

export const mockConstructEvent = vi.fn().mockReturnValue({
  type: "checkout.session.completed",
  data: {
    object: {
      metadata: { userId: "user123", priceId: "p1" },
    },
  },
});

// Stripe must be mocked as a CLASS so "new Stripe()" works.
export const mockStripe = {
  default: class Stripe {
    constructor() {
      this.checkout = {
        sessions: { create: mockCreateSession },
      };
      this.webhooks = {
        constructEvent: mockConstructEvent,
      };
    }
  },
};
