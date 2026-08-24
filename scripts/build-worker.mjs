/**
 * Build the TypeScript service worker into a single JS file.
 *
 * Service workers run in a separate scope and cannot use native ES
 * module imports in browsers. This script bundles logger-worker.ts
 * and all its local imports into one self-contained file that is
 * written to public/logger-worker.js (matching the registration URL
 * used in index.tsx).
 *
 * Environment: the worker needs build-time values of `process.env.REACT_APP_*`.
 * Pass the mode as the first CLI argument ("development" or "production",
 * default: "development") — the script loads the matching `.env.<mode>` file
 * (plus `.env`) and inlines every `REACT_APP_*` variable into the bundle via
 * esbuild `define`, mirroring what Create React App does for the main bundle.
 *
 * Usage:
 *   node scripts/build-worker.mjs            # development (loads .env.development)
 *   node scripts/build-worker.mjs production # production (loads .env.production)
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
// otherwise default to development (covers manual `node scripts/build-worker.mjs`).

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
  `Worker build mode: ${mode} (` +
    `${Object.keys(define).length - 1} REACT_APP_* variables inlined)`,
);

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
  define,
});

if (result.errors.length > 0) {
  console.error("Build failed:");
  for (const err of result.errors) {
    console.error(`  ${err.text}`);
  }
  process.exit(1);
}

console.log("✓ logger-worker.js built successfully");