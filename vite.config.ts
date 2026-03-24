import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src",
  base: "/",
  plugins: [tailwindcss(), react()],
  build: {
    outDir: "../dist/",
    emptyOutDir: false,
  },
});
