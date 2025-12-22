// backend/src/config/env.js
import "dotenv/config";
import { cleanEnv, str, url, port } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 8080 }),

  // 🔐 Supabase
  SUPABASE_URL: url(),
  SUPABASE_ANON_KEY: str(),
  SUPABASE_SERVICE_ROLE_KEY: str(),

  // 🧠 OpenAI
  OPENAI_API_KEY: str(),

  // 💳 Stripe
  STRIPE_SECRET_KEY: str(),
  STRIPE_WEBHOOK_SECRET: str(),
  STRIPE_PRICE_STARTER: str(),
  STRIPE_PRICE_PRO: str(),

  // 🌍 Frontend
  FRONTEND_URL: url(),

  // 🔁 Cron
  CRON_SECRET: str(),

  // 🗄️ Prisma / Database
  DATABASE_URL: str(), 
  DIRECT_URL: str(),  
});

const FRONTEND_ORIGIN = new URL(env.FRONTEND_URL).origin;

export const config = {
  server: { port: env.PORT },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  openai: { apiKey: env.OPENAI_API_KEY },
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    starterPrice: env.STRIPE_PRICE_STARTER,
    proPrice: env.STRIPE_PRICE_PRO,
  },
  frontend: {
    url: env.FRONTEND_URL,
    origin: FRONTEND_ORIGIN,
  },
};
