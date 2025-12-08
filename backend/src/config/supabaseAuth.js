// backend/src/config/supabaseAuth.js
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env.js";

export const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
