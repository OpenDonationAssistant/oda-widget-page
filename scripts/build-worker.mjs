/**
 * Build the TypeScript service worker into a single JS file.
 *
 * Service workers run in a separate scope and cannot use native ES
 * module imports in browsers. This script bundles logger-worker.ts
 * and all its local imports into one self-contained file that is
 * written to public/logger-worker.js (matching the registration URL
 * used in index.tsx).
 *
 * Usage:  node scripts/build-worker.mjs
 */

import * as esbuild from "esbuild";
import { existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Ensure the output directory exists
const outDir = resolve(root, "public");
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const result = await esbuild.build({
  entryPoints: [resolve(root, "src/sw/logger-worker/logger-worker.ts")],
  outfile: resolve(outDir, "logger-worker.js"),
  bundle: true,
  format: "esm",
  target: "es2021",
  platform: "browser",
  minify: false,
  sourcemap: false,
  logLevel: "info",
});

if (result.errors.length > 0) {
  console.error("Build failed:");
  for (const err of result.errors) {
    console.error(`  ${err.text}`);
  }
  process.exit(1);
}

console.log("✓ logger-worker.js built successfully");
