// backend/src/services/extract/cvExtract.service.js
import mammoth from "mammoth";
import path from "path";
import pdfParse from "pdf-parse";
import { supabase } from "../../config/supabase.js";

export async function uploadCVToSupabase(file) {
  const filePath = `uploads/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("cv-files")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error("Error uploading file to Supabase Storage");
  }
}

export async function extractCVText(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".txt") return file.buffer.toString("utf8");

  if (ext === ".pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (ext === ".docx") {
    const { value } = await mammoth.extractRawText({ buffer: file.buffer });
    return value;
  }

  throw new Error("Unsupported file format. Use .pdf, .docx or .txt.");
}
