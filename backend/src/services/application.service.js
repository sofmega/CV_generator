// backend/src/services/application.service.js
import { supabase } from "../config/supabase.js";

export async function saveApplication({ jobDescription, cvText, type, generatedText }) {
  const { error } = await supabase.from("applications").insert({
    job_description: jobDescription,
    cv_text: cvText || null,
    generated_type: type,
    generated_text: generatedText,
  });

  if (error) {
    console.error("DB insert failed:", error);
  }
}
