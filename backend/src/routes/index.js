// backend/src/routes/index.js
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { logger } from "../config/logger.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routeFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".routes.js") && file !== "index.js");

for (const file of routeFiles) {
  const fullPath = path.join(__dirname, file);
  const moduleUrl = pathToFileURL(fullPath).href;

  const mod = await import(moduleUrl);
  const route = mod.default;

  if (!route) {
    logger.warn(`${file} has no default export, skipping.`);
    continue;
  }

  const base = file.replace(".routes.js", "");
  const mountPath = `/${base}`;

  logger.info(`Mounted ${file} at ${mountPath}`);
  router.use(mountPath, route);
}

export default router;
