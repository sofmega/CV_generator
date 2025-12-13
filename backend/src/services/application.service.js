// backend/src/services/application.service.js
import { supabase } from "../config/supabase.js";
import { logger } from "../config/logger.js";

export async function saveApplication({
  userId,
  jobDescription,
  cvText,
  type,
  generatedText,
}) {
  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: userId, 
      job_description: jobDescription,
      cv_text: cvText || null,
      generated_type: type,
      generated_text: generatedText,
    })
    .select()
    .single();

  if (error) {
    logger.error({ err: error }, "DB insert failed");
    throw new Error("Failed to save application");
  }

  return data;
}
