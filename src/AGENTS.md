# src/ — Application Source

## OVERVIEW
535 files: 300 .tsx, 128 .css (113 CSS Modules), 86 .ts, plus png/svg/json/mdx. Single entry point, ~29 widget feature modules.

## STRUCTURE
```
src/
├── index.tsx              # entry — createBrowserRouter, all routes, providers, bootstrap
├── WidgetWrapper.tsx      # socket subscribe/publish shell for embedded widgets
├── worker.ts              # SharedWorker port singleton (sendMessageToWorker)
├── emoteCacheWorker.ts    # ServiceWorker registration + emote forwarding
├── auth.ts                # OAuth session (auth, separateWidgetAuth)
├── config.ts              # endpoint defs (known typo: alertWidgetCommans)
├── socket.ts              # STOMP client (uses `var`)
├── logging.ts             # pino logger
├── utils.ts               # general helpers
├── i18n.js                # only plain-JS file in src
├── pages/                 # 29 widget dirs (one per feature)
├── components/            # shared UI + ConfigurationPage (property editors)
├── stores/                # 15 global MobX stores
├── icons/                 # 43+ hand-rolled SVG components
├── sw/                    # logger-worker + emote-cache-worker sources
├── logic/                 # playlist, voice controllers
├── types/                 # Preset, WidgetData, Widget
├── locales/               # en, ru
├── bus/                   # EventBus pub/sub
├── contexts/              # AuthContext, WidgetSettingsContext
├── wizards/               # wordblacklist wizard
├── shared/                # features.ts (feature flags)
└── stories/               # CRA boilerplate — not real app code
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Routing / bootstrap | `index.tsx` — `createBrowserRouter`, all routes, `widgetSettingsLoader` |
| Embedded widget behavior | `WidgetWrapper.tsx` — STOMP subscribe/publish |
| OAuth flow | `auth.ts` |
| Realtime handlers | `sw/logger-worker/handlers/` — per-platform chat/donation |
| Emote cache logic | `sw/emote-cache-worker/` — 7TV cache-first |
| Event system | `bus/EventBus.ts` |
| Auth widget settings | `contexts/AuthContext.tsx`, `contexts/WidgetSettingsContext.tsx` |
| i18n setup | `i18n.js` + `locales/{en,ru}/` |

## CONVENTIONS (src-specific)
- `index.tsx` is the single routing entry — all widget routes defined inline (~26).
- Worker sources live in `src/sw/` but are NOT bundled here; `scripts/*.mjs` at root does that.
- `sw/logger-worker/utils/` exists but is empty — don't import from it.
- `logic/` is for complex runtime behavior (playlist sequencing, voice), not UI.

## ANTI-PATTERNS (src-specific)
- **Do NOT treat `stories/` as app code** — CRA boilerplate, none of it is used.
- **Do NOT re-enable `window.onerror` in `index.tsx` casually** — 26-line block is commented out intentionally; changing it requires understanding the global error recovery design.
- **Do NOT import from `sw/logger-worker/utils/`** — directory is empty, no exports exist.
- **Do NOT use `var` elsewhere** — `socket.ts` is the sole deviation; maintain consistency.
