// backend/src/services/uploadCV.service.js
import { supabase } from "../config/supabase.js";
import crypto from "crypto";

export async function uploadCVToStorage(file) {
  const ext = file.originalname.split(".").pop();
  const safeName = crypto.randomUUID() + "." + ext;

  const { data, error } = await supabase.storage
    .from("cv-files/uploads")
    .upload(safeName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error("Failed to upload CV to storage: " + error.message);

  return data.path; 
}
