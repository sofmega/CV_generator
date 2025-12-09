// backend/src/config/env.js
import "dotenv/config";
import { cleanEnv, str, url, port } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 8080 }),
  SUPABASE_URL: url(),
  SUPABASE_ANON_KEY: str(),
  SUPABASE_SERVICE_ROLE_KEY: str(),
  OPENAI_API_KEY: str(),
  STRIPE_SECRET_KEY: str(),
  STRIPE_WEBHOOK_SECRET: str(),
  FRONTEND_URL: url(),
});

