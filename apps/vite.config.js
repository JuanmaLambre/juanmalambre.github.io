import { readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "src");

// Every folder in src/ holding an index.html becomes its own page in the build.
// Adding a new app only means creating the folder, no need to touch this file.
const pages = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => resolve(root, entry.name, "index.html"))
  .filter((htmlPath) => existsSync(htmlPath));

export default defineConfig({
  root,
  base: "/apps/",
  plugins: [tailwindcss(), react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: [resolve(root, "index.html"), ...pages],
    },
  },
});
