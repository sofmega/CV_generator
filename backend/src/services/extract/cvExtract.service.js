// backend/src/services/extract/cvExtract.service.js
import mammoth from "mammoth";
import path from "path";
import crypto from "crypto";

// FIX: load pdf-parse using CommonJS
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import { supabase } from "../../config/supabase.js";

// -----------------------------------------------------------------------------
// Upload the file to Supabase Storage (returns the internal path)
// -----------------------------------------------------------------------------
export async function uploadCVToSupabase(file) {
  const ext = file.originalname.split(".").pop();
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const filePath = `uploads/${safeName}`;

  const { data, error } = await supabase.storage
    .from("cv-files")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error("Error uploading file to Supabase Storage: " + error.message);
  }

  return filePath;
}

// -----------------------------------------------------------------------------
// Download file from Supabase Storage (returns a Buffer)
// -----------------------------------------------------------------------------
export async function downloadFromSupabase(filePath) {
  const { data, error } = await supabase.storage
    .from("cv-files")
    .download(filePath);

  if (error) {
    throw new Error("Error downloading file from Supabase Storage");
  }

  // Convert Blob → Buffer
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// -----------------------------------------------------------------------------
// Extract text (uses STORAGE BUFFER, not Multer RAM buffer)
// -----------------------------------------------------------------------------
export async function extractCVTextFromStorage(filePath) {
  const fileExt = path.extname(filePath).toLowerCase();

  const buffer = await downloadFromSupabase(filePath);

  if (fileExt === ".txt") {
    return buffer.toString("utf8");
  }

  if (fileExt === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (fileExt === ".docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  throw new Error("Unsupported file format. Use .pdf, .docx or .txt.");
}
