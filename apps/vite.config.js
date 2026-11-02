import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "src");

// The favicon goes inside each app's HTML too, so a downloaded app needs nothing
// else. The home page keeps linking to it.
function inlineFavicon() {
  const favicon = `data:image/svg+xml;base64,${readFileSync(resolve(here, "../favicon.svg")).toString("base64")}`;
  return {
    name: "inline-favicon",
    apply: () => Boolean(process.env.PAGE),
    transformIndexHtml: (html) => html.replace('href="/favicon.svg"', `href="${favicon}"`),
  };
}

// scripts/build.js builds one page at a time (PAGE is its folder inside src/, empty
// for the home page) and, for the apps, inlines the result into a single HTML file.
export default defineConfig({
  root,
  base: "/apps/",
  plugins: [inlineFavicon(), tailwindcss(), react()],
  build: {
    write: false,
    modulePreload: false,
    rollupOptions: { input: resolve(root, process.env.PAGE ?? "", "index.html") },
  },
});
