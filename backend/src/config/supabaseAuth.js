// backend/src/config/supabaseAuth.js
import { createClient } from "@supabase/supabase-js";
import { config } from "./env.js";

export const supabaseAuth = createClient(
  config.supabase.url,
  config.supabase.anonKey
);
