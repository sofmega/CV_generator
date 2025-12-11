// backend/src/config/logger.js
import pino from "pino";
import { env } from "./env.js";

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
  level: "info",
  transport: isProd
    ? undefined // JSON logs for production
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: true,
        },
      },
});
