// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    plugins: [
      react(),

      
      isBuild &&
        prerender({
          
          routes: [
  "/",
  "/ai-cv-generator",
  "/cover-letter-generator",
  "/pricing",
  "/blog",
  "/blog/how-to-tailor-your-cv-to-a-job-offer",
  "/blog/ats-friendly-cv-what-it-is",
],


          
          renderer: new PuppeteerRenderer({
            renderAfterTime: 1000,
          }),
        }),
    ].filter(Boolean),
  };
});
