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
          
          routes: ["/", "/ai-cv-generator", "/cover-letter-generator", "/pricing"],

          
          renderer: new PuppeteerRenderer({
            renderAfterTime: 1000,
          }),
        }),
    ].filter(Boolean),
  };
});
