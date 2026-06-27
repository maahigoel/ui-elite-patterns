import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On GitHub Actions the site is served from https://<user>.github.io/ui-elite-patterns/,
// so it needs that repo base path. Locally it stays at "/".
const base = process.env.GITHUB_ACTIONS ? "/ui-elite-patterns/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173, open: true },
});
