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

  STRIPE_PRICE_STARTER: str(),
  STRIPE_PRICE_PRO: str(),

  FRONTEND_URL: url(),
});

export const config = {
  server: {
    port: env.PORT,
  },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    starterPrice: env.STRIPE_PRICE_STARTER,
    proPrice: env.STRIPE_PRICE_PRO,
  },
  frontend: {
    url: env.FRONTEND_URL,
  },
};
