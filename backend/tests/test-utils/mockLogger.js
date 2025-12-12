// backend/tests/test-utils/mockLogger.js
import { vi } from "vitest";

// Pino-compatible mock logger
export const mockLogger = {
  level: 'info',
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),

  // Required for pino-http
  child: vi.fn().mockReturnThis(),
  bindings: vi.fn().mockReturnValue({}),
  flush: vi.fn(),

  // Pino internals sometimes access symbol properties
  [Symbol.for('pino.metadata')]: true,
};
