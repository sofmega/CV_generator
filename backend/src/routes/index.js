// src/routes/index.js
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const router = Router();

// Normalize path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only import *.routes.js files
const routeFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.endsWith(".routes.js") &&
      file !== "index.js"
  );

for (const file of routeFiles) {
  const fullPath = path.join(__dirname, file);

  // Convert Windows path → file:// url
  const moduleUrl = pathToFileURL(fullPath).href;

  const mod = await import(moduleUrl);
  const route = mod.default;

  if (!route) {
    console.warn(`⚠️ ${file} has no default export, skipping.`);
    continue;
  }

  // Derive endpoint: "extract-cv.routes.js" → "/extract-cv"
  const base = file.replace(".routes.js", "");
  const mountPath = `/${base}`;

  console.log(`✅ Mounted ${file} at ${mountPath}`);
  router.use(mountPath, route);
}

export default router;
