// prisma.config.ts  (or at project root: prisma.config.ts)

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",  // Adjust if your schema is elsewhere

  datasource: {
    // This URL is used by Prisma CLI commands: db pull, migrate, etc.
    // For Supabase: Use the **direct** connection (port 5432, no pgbouncer) here
    url: env("DIRECT_URL"),
  },
});