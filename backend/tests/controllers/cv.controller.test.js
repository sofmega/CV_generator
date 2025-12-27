import request from "supertest";
import { vi, describe, it, expect, beforeAll } from "vitest";
import { mockLogger } from "../test-utils/mockLogger.js";

// Mock logger
vi.mock("../../src/config/logger.js", () => ({
  logger: mockLogger,
}));

// Mock authMiddleware → always authenticate
vi.mock("../../src/middleware/auth.js", () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id: "user123", email: "test@test.com" };
    next();
  },
}));

// Mock usageLimiter → always allow in tests
vi.mock("../../src/middleware/usageLimiter.js", () => ({
  usageLimiter: (req, res, next) => next(),
}));

// Mock rate limiters → always allow in tests
vi.mock("../../src/middleware/rateLimit.js", () => ({
  aiGenerationLimiter: (req, res, next) => next(),
  uploadLimiter: (req, res, next) => next(),
}));

// Mock services
vi.mock("../../src/services/cv/cvText.service.js", () => ({
  generateCVText: vi.fn().mockResolvedValue("mocked-cv-text"),
}));

vi.mock("../../src/services/application.service.js", () => ({
  saveApplication: vi.fn().mockResolvedValue(true),
}));

let app;
beforeAll(async () => {
  app = (await import("../../src/app.js")).default;
});

describe("CV Text Generation", () => {
  it("returns generated text", async () => {
    const res = await request(app).post("/cv/text").send({
      jobDescription: "Developer job",
      cvText: "My CV",
    });

    expect(res.status).toBe(200);
    expect(res.body.result).toBe("mocked-cv-text");
  });
});
