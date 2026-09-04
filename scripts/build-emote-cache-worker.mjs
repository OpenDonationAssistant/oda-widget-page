/**
 * Build the TypeScript emote-cache service worker into a single JS file.
 *
 * Service workers run in a separate scope and cannot use native ES module
 * imports in browsers. This script bundles emote-cache-worker.ts and all its
 * local imports into one self-contained file that is written to
 * public/emote-cache-worker.js (matching the URL used by
 * `navigator.serviceWorker.register(...)` in src/emoteCacheWorker.ts).
 *
 * Environment: mirrors scripts/build-worker.mjs — the worker needs build-time
 * values of `process.env.REACT_APP_*`. Pass the mode as the first CLI argument
 * ("development" or "production", default: "development") — the script loads
 * the matching `.env.<mode>` file (plus `.env`) and inlines every
 * `REACT_APP_*` variable into the bundle via esbuild `define`.
 *
 * Usage:
 *   node scripts/build-emote-cache-worker.mjs            # development
 *   node scripts/build-emote-cache-worker.mjs production # production
 */

import * as esbuild from "esbuild";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Ensure the output directory exists
const outDir = resolve(root, "public");
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

// ── Environment loading ─────────────────────────────────────────────
//
// Determine which .env file to use. Explicit CLI arg wins, then NODE_ENV,
// otherwise default to development (covers manual `node scripts/build-emote-cache-worker.mjs`).

const mode =
  process.argv[2] ?? process.env.NODE_ENV ?? "development";

function loadEnvFile(filePath) {
  const env = {};
  if (!existsSync(filePath)) return env;
  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip surrounding quotes (double or single)
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

// CRA precedence: `.env.<mode>` overrides `.env` (`.env.local` etc. are
// intentionally ignored here to keep the worker build deterministic).
const env = {
  ...loadEnvFile(resolve(root, ".env")),
  ...loadEnvFile(resolve(root, `.env.${mode}`)),
};

const define = {
  "process.env.NODE_ENV": JSON.stringify(mode),
};
for (const [key, value] of Object.entries(env)) {
  if (key.startsWith("REACT_APP_")) {
    define[`process.env.${key}`] = JSON.stringify(value);
  }
}

console.log(
  `Emote cache worker build mode: ${mode} (` +
    `${Object.keys(define).length - 1} REACT_APP_* variables inlined)`,
);

const result = await esbuild.build({
  entryPoints: [resolve(root, "src/sw/emote-cache-worker/emote-cache-worker.ts")],
  outfile: resolve(outDir, "emote-cache-worker.js"),
  bundle: true,
  // Service workers are constructed as classic scripts, so the bundle must
  // be a classic script — IIFE is the safe format.
  format: "iife",
  target: "es2021",
  platform: "browser",
  minify: false,
  sourcemap: false,
  logLevel: "info",
  define,
});

if (result.errors.length > 0) {
  console.error("Build failed:");
  for (const err of result.errors) {
    console.error(`  ${err.text}`);
  }
  process.exit(1);
}

console.log("✓ emote-cache-worker.js built successfully");