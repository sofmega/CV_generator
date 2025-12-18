// backend/src/services/storage/cleanupCvFiles.service.js
import { supabase } from "../../config/supabase.js";

const BUCKET = "cv-files";
const FOLDER = "uploads";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export async function cleanupOldCvs() {
  const now = Date.now();

  const { data: files, error } = await supabase.storage
    .from(BUCKET)
    .list(FOLDER, { limit: 1000 });

  if (error) throw error;

  const toDelete = files
    .filter((file) => {
      if (!file.created_at) return false;
      return now - new Date(file.created_at).getTime() > MAX_AGE_MS;
    })
    .map((file) => `${FOLDER}/${file.name}`);

  if (toDelete.length === 0) return;

  const { error: deleteErr } = await supabase.storage
    .from(BUCKET)
    .remove(toDelete);

  if (deleteErr) throw deleteErr;
}
