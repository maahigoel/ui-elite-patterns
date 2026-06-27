/**
 * Pulls every renderable component out of the ui-mcp registry (the source of
 * truth that powers the MCP server) and writes:
 *   - src/generated/<id>.tsx   — one standalone component per registry entry
 *   - src/generated/manifest.ts — metadata + source for the gallery
 *
 * This keeps the demo perfectly in sync with the MCP: regenerate and the site
 * reflects whatever the server would hand to Claude Code.
 */
import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const demoRoot = resolve(__dirname, "..");
const repoRoot = resolve(demoRoot, "..");
const distMarker = resolve(repoRoot, "dist/registry/patterns.js");

if (!existsSync(distMarker)) {
  // Cold clone: the registry hasn't been built yet (dist/ is gitignored).
  // Bootstrap it so `cd demo && npm install && npm run dev` works on its own.
  if (!existsSync(resolve(repoRoot, "node_modules"))) {
    console.log("[generate] installing registry dependencies...");
    execSync("npm install", { cwd: repoRoot, stdio: "inherit" });
  }
  console.log("[generate] building registry...");
  execSync("npm run build", { cwd: repoRoot, stdio: "inherit" });
}

const { patterns } = await import(resolve(repoRoot, "dist/registry/patterns.js"));
const { components } = await import(resolve(repoRoot, "dist/registry/components.js"));
const { motionConfigs } = await import(resolve(repoRoot, "dist/registry/motion.js"));

const outDir = resolve(demoRoot, "src/generated");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const renderable = [
  ...patterns.map((e) => ({ ...e, kind: "pattern" })),
  ...components.map((e) => ({ ...e, kind: "component" })),
];

for (const entry of renderable) {
  writeFileSync(resolve(outDir, `${entry.id}.tsx`), entry.code.trimEnd() + "\n");
}

const manifest = renderable.map((e) => ({
  id: e.id,
  name: e.name,
  kind: e.kind,
  complexity: e.complexity,
  framework: e.framework,
  componentType: e.componentType ?? null,
  interaction: e.interaction ?? null,
  tags: e.tags,
  description: e.description,
  implementation_notes: e.implementation_notes,
  tailwind: e.tailwind,
  sources: e.sources,
  motion: e.motion ?? null,
  code: e.code.trim(),
}));

const manifestSrc =
  `// AUTO-GENERATED from the ui-mcp registry — do not edit by hand.\n` +
  `// Run \`npm run generate\` to refresh.\n\n` +
  `export interface DemoEntry {\n` +
  `  id: string;\n  name: string;\n  kind: "pattern" | "component";\n` +
  `  complexity: "clean" | "elevated" | "insane";\n  framework: string[];\n` +
  `  componentType: string | null;\n  interaction: string | null;\n` +
  `  tags: string[];\n  description: string;\n  implementation_notes: string;\n` +
  `  tailwind: string;\n  sources: string[];\n  motion: unknown;\n  code: string;\n}\n\n` +
  `export interface MotionEntry {\n  id: string;\n  name: string;\n  type: string;\n` +
  `  library: string;\n  tags: string[];\n  description: string;\n  config: unknown;\n` +
  `  variants?: unknown;\n  code: string;\n  usage: string;\n}\n\n` +
  `export const entries: DemoEntry[] = ${JSON.stringify(manifest, null, 2)};\n\n` +
  `export const motionConfigs: MotionEntry[] = ${JSON.stringify(motionConfigs, null, 2)};\n`;

writeFileSync(resolve(outDir, "manifest.ts"), manifestSrc);

console.log(
  `[generate] wrote ${renderable.length} components ` +
    `(${patterns.length} patterns + ${components.length} components) ` +
    `and manifest.ts (incl. ${motionConfigs.length} motion configs) to src/generated/`
);
