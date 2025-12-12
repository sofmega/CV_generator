// backend/tests/controllers/extract.controller.test.js
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

// Mock extract services
vi.mock("../../src/services/extract/cvExtract.service.js", () => ({
  uploadCVToSupabase: vi.fn().mockResolvedValue("mock-file-path"),
  extractCVTextFromStorage: vi.fn().mockResolvedValue("mock-extracted-text"),
}));

let app;
beforeAll(async () => {
  app = (await import("../../src/app.js")).default;
});

describe("extractCVController", () => {
  it("should return 400 when no file is uploaded", async () => {
    const res = await request(app).post("/extract-cv").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No file uploaded");
  });

  it("should extract text successfully", async () => {
    const res = await request(app)
      .post("/extract-cv")
      .attach("cv", Buffer.from("fake file"), "cv.pdf");

    expect(res.status).toBe(200);
    expect(res.body.text).toBe("mock-extracted-text");
  });
});
    