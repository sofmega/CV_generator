// backend/vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    dir: "tests",
    setupFiles: ["./tests/test-utils/setupEnv.js"],
  },
});
