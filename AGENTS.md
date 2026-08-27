# AGENTS.md

Open Donation Assistant (ODA) "widget page" — a React 18 SPA serving both a streamer
configuration dashboard (`/configuration/*`) and live streamer widgets (`/{widgetType}/:widgetId`).
Note: the npm package name is `oda-console`; the repo/dir is `oda-widget-page`.

## Commands

- `npm start` — dev server on **port 3001** (`PORT` is set in `.env.development`, not the CRA default 3000).
- `npm run build` — runs the `prebuild` hook (bundles the service worker, see below) then `react-scripts build`.
- `npm run build-worker` — rebuild `public/logger-worker.js` from `src/sw/` in development mode.
- `npm test` — Jest via `react-scripts test` (watch mode by default; use `CI=true npm test` for one-shot).
- `npm run storybook` — Storybook on port 6006; `npm run build-storybook` for a static build.
- `npx playwright test` — Playwright (no npm script; config in `playwright.config.ts`, tests in `tests/`).

There are **no `lint` or `typecheck` scripts**. `eslint.config.js` is a flat config that only applies
Storybook's recommended rules and ignores `src/videoplayer.js`. Real type checking is
`npx tsc --noEmit` — the build does *not* fail on type errors (see below).

## Env & build quirks

- All config flows through CRA-style `REACT_APP_*` variables. Backend endpoints are prefixed per
  microservice, e.g. `REACT_APP_WIDGET_API_ENDPOINT`, `REACT_APP_CONFIG_API_ENDPOINT`,
  `REACT_APP_WS_ENDPOINT` (STOMP WebSocket). Most values are supplied per environment via `.env*`
  files and are not committed defaults.
- `.env` sets `TSC_COMPILE_ON_ERROR=true`, `ESLINT_NO_DEV_ERRORS=true`, `DISABLE_REACT_ERROR_OVERLAY=true`
  — so `npm run build` **tolerates TS/lint errors** and the dev error overlay is suppressed.
  `tsconfig.json` has `strict: true`, but you must run `npx tsc --noEmit` yourself to catch type errors.
- `.npmrc`: `legacy-peer-deps=true` (required — react-scripts 5 + React 18 + Storybook 10 have
  conflicting peers) and `@opendonationassistant:registry=https://npm.pkg.github.com` (private packages;
  needs a GitHub Packages token — `gpr_token` build arg in the Dockerfile, `GPR_TOKEN` secret in CI).

## Service worker (non-obvious build step)

The service worker in `src/sw/logger-worker/` is **not built by react-scripts**.
`scripts/build-worker.mjs` (esbuild) bundles `src/sw/logger-worker/logger-worker.ts` into
`public/logger-worker.js`, inlining only `REACT_APP_*` env vars at build time. That output file is
gitignored. The `prebuild` hook runs it for production. If you edit `src/sw/` code or add a
`REACT_APP_*` var used inside the worker, run `npm run build-worker` (dev) or `npm run build`
to regenerate before testing.

## Architecture

- Entry: `src/index.tsx` — a single `createBrowserRouter` defining every route.
- `src/pages/` — one folder per feature/widget (26 pages). Widget routes are `/{type}/:widgetId`;
  the dashboard is under `/configuration/*`.
- `src/components/` — shared components plus `ConfigurationPage/` (Header/Toolbar).
- `src/stores/` — state management is **MobX** (`mobx` + `mobx-react-lite`), not Redux/Context.
- `src/bus/EventBus.ts` — central event bus; persists events to IndexedDB and relays via STOMP.
  Used by the service worker handlers.
- `src/sw/logger-worker/handlers/` — chat/donation provider shims (Twitch, VK Live, Kick,
  StreamElements, DonationAlerts, DonatePay/DonatePay-EU/DonateX). Donation handlers register only
  when the `SW_DONATIONS` feature flag is enabled (`src/shared/features.ts`).
- `src/socket.ts` — STOMP-over-WebSocket (`@stomp/stompjs`) for realtime widget commands
  (`/topic/commands`, e.g. reload).
- Styling: Ant Design 5 (dark theme), Bootstrap 5, plus global CSS
  (`index.css`, `ant.css`, `ant-override.css`, `newstyle.css`).
- i18n: `i18next` + `react-i18next`, fallback language `ru`; most UI strings are Russian.
  Locale JSON lives in `src/locales/`.

## Auth

OTP-exchange + refresh-token flow (`src/auth.ts`, `src/pages/Login/Login.tsx`). Tokens live in
`localStorage`: `access-token`, `refresh-token`, and per-widget `{widgetId}-access-token`. A
`?separateSession` query param gives a widget an isolated auth session. The service worker learns
the logged-in user via a `USER_AUTHORIZED` `postMessage`.

## Deploy / CI

- Docker: multi-stage — `node:20` builds, `httpd:2.4-alpine` serves `build/`. `httpd.conf` rewrites
  all non-file paths to `index.html` (SPA).
- CI (`.github/workflows/docker-image.yml`) triggers on push to **`master`** (not `main`): builds and
  pushes `ghcr.io/opendonationassistant/oda-widget-page:{RUN_NUMBER}`, then tags git with the run number.
- The default branch is `master`.

## Testing reality check

There are effectively no real tests. `tests/example.spec.ts` is the untouched Playwright scaffold
(hits `playwright.dev`). `npm test` is the stock CRA Jest setup. Don't assume meaningful coverage exists.
