// cvgen/src/utils/testSupabase.ts
import { supabase } from "../lib/supabaseClient";

export async function testSupabase() {
  const { data, error } = await supabase.from("test").select("*");
  console.log("DATA:", data, "ERROR:", error);
}
