process.env.NODE_ENV = "test";

// Required by envalid in src/config/env.js
process.env.CRON_SECRET = "test-cron-secret";
process.env.FRONTEND_URL = "https://example.com";

process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_ANON_KEY = "test-anon";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";

process.env.OPENAI_API_KEY = "test-openai";

process.env.STRIPE_SECRET_KEY = "sk_test_123";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_123";
process.env.STRIPE_PRICE_STARTER = "price_test_starter";
process.env.STRIPE_PRICE_PRO = "price_test_pro";

// Prisma / DB urls must look like valid connection strings
process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/testdb";
process.env.DIRECT_URL = "postgresql://user:pass@localhost:5432/testdb";
