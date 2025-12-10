// backend/src/services/application.service.js
import { supabase } from "../config/supabase.js";

export async function saveApplication({
  jobDescription,
  cvText,
  type,
  generatedText,
}) {
  const { data, error } = await supabase
    .from("applications")
    .insert({
      job_description: jobDescription,
      cv_text: cvText || null,
      generated_type: type,
      generated_text: generatedText,
    })
    .select()
    .single();

  if (error) {
    console.error("DB insert failed:", error);
   
    throw new Error("Failed to save application");
  }

  return data; 
}
