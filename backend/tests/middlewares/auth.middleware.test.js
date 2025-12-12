import { authMiddleware } from "../../src/middleware/auth.js";
import { vi, describe, it, expect } from "vitest";

vi.mock("../../src/config/supabaseAuth.js", () => ({
  supabaseAuth: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "123", email: "test@test.com" } },
        error: null
      })
    }
  }
}));


describe("authMiddleware", () => {
  it("attaches user to req when token is valid", async () => {
    const req = {
      headers: { authorization: "Bearer validtoken" }
    };
    const res = {};
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(req.user.id).toBe("123");
    expect(next).toHaveBeenCalled();
  });
});
