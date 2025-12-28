import { supabase } from "../../config/supabase.js";

/**
 * Save a feedback in DB (Supabase table: public.feedbacks).
 */
export async function saveFeedback({ userId, userEmail, message, page }) {
  const { error } = await supabase.from("feedbacks").insert({
    user_id: userId,
    user_email: userEmail,
    message,
    page: page ?? null,
  });

  if (error) {
    throw new Error(`Failed to save feedback: ${error.message}`);
  }

  return true;
}
