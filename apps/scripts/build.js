// Builds every app into a single self-contained HTML (JS and CSS inlined) and
// writes it where GitHub Pages serves it, <slug>/index.html, so an app saved from
// the browser works offline. The home page is a regular build: index.html plus
// its files in assets/.
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const here = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(here, "src");
// Every folder in src/ with an index.html is an app; "" is the home page.
const pages = ["", ...readdirSync(src).filter((name) => existsSync(resolve(src, name, "index.html")))];

// Inline code must not close its own <script>/<style> tag early.
const escapeTag = (code, tag) => code.replaceAll(`</${tag}`, `<\\/${tag}`);

function inline(html, files) {
  const read = (path) => {
    const file = files.get(basename(path));
    if (!file) throw new Error(`${path} is not in the bundle`);
    return file;
  };
  return html
    .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, (_, src) => {
      return `<script type="module">${escapeTag(read(src).code, "script")}</script>`;
    })
    .replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/g, (_, href) => {
      return `<style>${escapeTag(String(read(href).source), "style")}</style>`;
    });
}

// Old hashed files of the home page.
rmSync(resolve(here, "assets"), { recursive: true, force: true });

for (const page of pages) {
  process.env.PAGE = page;
  const { output } = await build({ configFile: resolve(here, "vite.config.js"), logLevel: "warn" });
  if (page === "") {
    for (const file of output) {
      const path = resolve(here, file.fileName);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, file.type === "chunk" ? file.code : file.source);
    }
    console.log(`index.html + ${output.length - 1} files in assets/`);
    continue;
  }
  const files = new Map(output.map((file) => [basename(file.fileName), file]));
  const html = inline(String(output.find((file) => file.fileName.endsWith(".html")).source), files);
  if (/(src|href)="\/apps\//.test(html)) throw new Error(`${page} still references external files`);
  const outDir = resolve(here, page);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  console.log(`${page}/index.html  ${(html.length / 1024).toFixed(0)} kB`);
}
