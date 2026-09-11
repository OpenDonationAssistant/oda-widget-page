# PROJECT KNOWLEDGE BASE

**Generated:** 2026-09-11 10:17 UTC
**Commit:** e91e29c
**Branch:** master

## OVERVIEW
ODA Widgets (`oda-console`) — React 18 + TypeScript SPA for configuring and rendering streaming widgets (alerts, chat, donation goals, etc.). Built with Create React App (react-scripts 5), MobX state, Ant Design 5, i18next, STOMP/WebSocket realtime, and two web workers (SharedWorker logger + ServiceWorker emote cache).

## STRUCTURE
```
oda-widget-page/
├── src/                  # all application code (535 files)
│   ├── pages/            # 29 widget feature modules (one dir per widget)
│   ├── components/       # shared UI + ConfigurationPage (property editors)
│   ├── stores/           # global MobX stores
│   ├── icons/            # hand-rolled SVG icon components
│   ├── sw/               # worker sources (logger-worker, emote-cache-worker)
│   ├── logic/            # playlist, voice controllers
│   ├── types/            # domain types (Preset, WidgetData, Widget)
│   ├── locales/          # i18n (en, ru)
│   └── index.tsx         # main entry: router, providers, bootstrap
├── scripts/              # esbuild worker bundlers (prebuild step)
├── public/               # static + GENERATED worker bundles (gitignored)
├── tests/                # Playwright e2e (boilerplate only)
├── .storybook/           # Storybook 10 config
└── Dockerfile            # node:20 build → httpd:2.4-alpine serve
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add a new widget | `src/pages/<WidgetName>/` | Follow `<Name>Widget.tsx` + `<Name>WidgetPage.tsx` + `<Name>WidgetSettings.tsx` + `<Name>Store.ts(x)` pattern |
| Add a property editor | `src/components/ConfigurationPage/widgetproperties/` | One file per widget setting input |
| Add widget settings UI | `src/components/ConfigurationPage/widgetsettings/` | Per-widget settings panels |
| Global state | `src/stores/` | MobX `makeAutoObservable` classes + React contexts |
| Realtime events | `src/sw/logger-worker/handlers/` | Per-platform chat/donation handlers |
| Emote caching | `src/sw/emote-cache-worker/` | ServiceWorker, 7TV cache-first |
| Routing / bootstrap | `src/index.tsx` | `createBrowserRouter`, all routes defined here |
| Env endpoints | `.env.*` | `REACT_APP_<SERVICE>_API_ENDPOINT` naming |
| Worker rebuild | `npm run build-worker` / `build-emote-cache-worker` | esbuild IIFE, env inlined via `define` |

## CODE MAP
| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| `createBrowserRouter` | call | `src/index.tsx` | — | Route table (config + ~26 widget routes) |
| `widgetSettingsLoader` | fn | `src/index.tsx` | all routes | Auth + widget settings fetch per route |
| `WidgetWrapper` | component | `src/WidgetWrapper.tsx` | widget routes | Socket subscribe/publish shell for embedded widgets |
| `auth()` / `separateWidgetAuth()` | fn | `src/auth.ts` | loaders | OAuth session, token in localStorage |
| `sendMessageToWorker` | fn | `src/worker.ts` | many | SharedWorker port singleton |
| `registerEmoteCacheWorker` | fn | `src/emoteCacheWorker.ts` | index.tsx | SW registration + emote forwarding |
| `DefaultEventBus` | class | `src/bus/EventBus.ts` | widgets | Event pub/sub |
| `DefaultAppStore` | class | `src/stores/AppStore.ts` | index.tsx | Global app state |
| `DefaultWidgetStore` | class | `src/stores/WidgetStore.ts` | index.tsx | Widget settings state |
| `DefaultEmotesStore` | class | `src/stores/EmotesStore.ts` | widgets | 7TV emote fetching |
| `FontStore` | class | `src/stores/FontStore.ts` | index.tsx | Font loading/context |
| `ErrorStore` | class | `src/stores/ErrorStore.ts` | index.tsx | Global error hub |
| `register()` (handlers) | fn | `src/sw/logger-worker/handlers/*` | logger-worker.ts | Per-platform event registration |
| `buildOtelPayload` | fn | `src/sw/logger-worker/otel-payload.ts` | worker | OpenTelemetry log payloads |

## CONVENTIONS
- **Widget folder pattern** (canonical, see `src/pages/AuctionWidget/README.md`): `<Name>Widget.tsx` (OBS/embed), `<Name>WidgetPage.tsx` (router entry, default export), `<Name>WidgetSettings.tsx`, `<Name>Store.ts(x)`, `<Name>State.ts`, `<Name>Demo*.ts` (mock variants), `<Name>.module.css`.
- **Stores**: MobX `makeAutoObservable(this)`, `_`-prefixed private members, getters for observed state. Interface + `Default*` impl + `Demo*` impl + React context per store.
- **Env vars**: `REACT_APP_<SERVICE>_API_ENDPOINT` SCREAMING_SNAKE_CASE, read via `process.env.REACT_APP_*`.
- **CSS**: CSS Modules (`*.module.css`) colocated; global CSS at `src/` root (`ant.css`, `index.css`, `newstyle.css`).
- **Formatting**: double quotes, no semicolons (manual — no Prettier config).
- **Test utils**: co-located `<Component>.test-utils.tsx` factories, consumed by adjacent `*.stories.tsx`.
- **Workers**: sources in `src/sw/`, bundled by `scripts/*.mjs` esbuild to `public/*.js` (gitignored). `prebuild` runs before every `npm run build`.

## ANTI-PATTERNS (THIS PROJECT)
- **Do NOT commit generated worker bundles** — `public/logger-worker.js` / `public/emote-cache-worker.js` are gitignored build outputs.
- **Do NOT add new plain-CSS siblings** — use CSS Modules; legacy plain CSS exists in `components/ConfigurationPage/css/` and per-page.
- **Do NOT write stores as `.tsx` without JSX** — prefer `.ts`; existing `.tsx` stores are legacy.
- **Do NOT add `any` liberally** — `strict: true` is on; existing `any` usage is debt.
- **Do NOT rely on `.env.systemd`** — CRA only loads `.env`, `.env.development`, `.env.test`, `.env.production`.
- **Do NOT add routes with inconsistent URL casing** — existing routes mix kebab and non-hyphenated paths; keep new ones kebab-case.
- **Do NOT touch the `window.onerror`/`onunhandledrejection` block in `index.tsx` casually** — it is commented out; changing it requires understanding the global error recovery design.

## UNIQUE STYLES
- Dual ESLint: legacy `eslintConfig` in package.json (CRA) + flat `eslint.config.js` (Storybook plugin only).
- `browserslist` relaxed to "last 1" Chrome/Firefox/Safari.
- Private npm registry: `@opendonationassistant/*` from GitHub Packages (`.npmrc`, `legacy-peer-deps=true`).
- Two realtime stacks: modern `@stomp/stompjs` (active) + legacy `socket.io-client` (unused).
- `var` used in `src/socket.ts` (deviation).
- Known typo: `alertWidgetCommans` in `src/config.ts`.

## COMMANDS
```bash
npm start                    # dev server, PORT=3001 (set in .env.development, not CRA default 3000)
npm run build-worker         # rebuild logger SharedWorker (dev)
npm run build-emote-cache-worker  # rebuild emote-cache SW (dev)
npm run build                # prebuild (workers) + react-scripts build → build/
npm test                     # Jest (CRA) watch mode; CI=true npm test for one-shot
npm run storybook            # Storybook dev, port 6006
npx playwright test          # e2e (tests/example.spec.ts only)
npx tsc --noEmit             # the REAL typecheck — build tolerates TS errors
```

## AUTH
OTP-exchange + refresh-token flow (`src/auth.ts`, `src/pages/Login/Login.tsx`). Tokens in `localStorage`: `access-token`, `refresh-token`, per-widget `{widgetId}-access-token`. `?separateSession` query param gives a widget an isolated auth session. Worker learns the user via `USER_AUTHORIZED` postMessage.

## NOTES
- **No `lint` or `typecheck` scripts exist.** `eslint.config.js` is flat config applying only Storybook rules. `.env` sets `TSC_COMPILE_ON_ERROR=true` / `ESLINT_NO_DEV_ERRORS=true` / `DISABLE_REACT_ERROR_OVERLAY=true` — `npm run build` tolerates TS/lint errors; run `npx tsc --noEmit` yourself.
- `npm run build` does NOT regenerate workers — only `prebuild` does. A raw `react-scripts build` ships stale workers. If you edit `src/sw/` or add a `REACT_APP_*` var used in a worker, run `npm run build-worker` (dev) or `npm run build`.
- `EventBus` (`src/bus/EventBus.ts`) persists events to IndexedDB and relays via STOMP.
- i18n fallback language is `ru`; most UI strings are Russian. Locale JSON in `src/locales/`.
- Donation handlers in `src/sw/logger-worker/handlers/` register only when the `SW_DONATIONS` feature flag is enabled (`src/shared/features.ts`).
- `eslint.config.js` references `src/videoplayer.js` in `globalIgnores` — file does not exist (stale).
- `src/stories/` is CRA boilerplate, not real app code.
- `AuctionWidgetPage.tsx` imports a demo store (commented-out real store) — production risk.
- `CommandsStore.ts` / `RewardsStore.ts` `load()`/`save()` are empty stubs — feature non-functional.
- CI (`.github/workflows/docker-image.yml`) runs NO tests — Docker build + push to GHCR only. Triggers on push to `master` (not `main`).
- Image tag = GitHub RUN_NUMBER (monotonic integer), also pushed as git tag.
- `.npmrc`: `legacy-peer-deps=true` (required — react-scripts 5 + React 18 + Storybook 10 have conflicting peers) + `@opendonationassistant` registry from GitHub Packages (needs `gpr_token` build arg / `GPR_TOKEN` secret).