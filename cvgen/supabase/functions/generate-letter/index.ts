// supabase/functions/generate-letter/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

serve(() => {
  return new Response(
    JSON.stringify({ message: "Edge function is running!" }),
    { headers: { "Content-Type": "application/json" } }
  );
});
