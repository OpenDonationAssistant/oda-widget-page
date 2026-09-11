# src/stores/ — Global MobX Stores

**Generated:** 2026-09-11
**Commit:** e91e29c
**Branch:** master

## OVERVIEW
Global MobX stores for oda-console — app/widget/preset/token/emote/font/error state. 15 files, all plain `.ts` (no `.tsx`).

## WHERE TO LOOK
| Store | File | Role |
|-------|------|------|
| AppStore | `AppStore.ts` | Global app state (`DefaultAppStore`, no context) |
| WidgetStore | `WidgetStore.ts` | Widget settings state (`DefaultWidgetStore` + `WidgetStoreContext`) |
| PresetStore | `PresetStore.ts` | Preset state (`DefaultPresetStore` + `PresetStoreContext`) |
| TokenStore | `TokenStore.ts` | OAuth token (`DefaultTokenStore` + `DemoTokenStore` + `TokenStoreContext`) |
| EmotesStore | `EmotesStore.ts` | 7TV emote fetching — most complex (~250 lines) |
| FontStore | `FontStore.ts` | Font loading (`FontStore` + `FontContext`) |
| ErrorStore | `ErrorStore.ts` | Global error hub (`ErrorStore` + `ErrorStoreContext` + `initGlobalErrorStore`) |
| VariableStore | `VariableStore.ts` | Widget variables (`DefaultVariableStore` + `useVariableStore` hook) |
| WorkersStore | `WorkersStore.ts` | Worker status (`DefaultWorkersStore` + `getConnectedServices`/`getErrors` helpers) |
| ReelStore | `ReelStore.ts` | Reel/roulette (`DefaultReelStore` + `DemoReelStore` + `RouletteItem`) |
| BotStore | `BotStore.ts` | Bot domain (`Bot`, `MaxButton`, `Announcer` + `BotStoreContext`) |
| GamesStore | `GamesStore.ts` | Game integrations (`DefaultGamesStore` + `DemoGamesStore` + `GamesStoreContext`) |
| NewsStore | `NewsStore.ts` | News (`DefaultNewsStore`, no context) |
| ExecutionStore | `ExecutionStore.ts` | Execution state (`ExecutionStore` + `ExecutionStoreContext`) |
| SelectedIndexStore | `SelectedIndexStore.ts` | Selected index (`SelectedIndexStore` + `SelectedIndexContext`) |

## CONVENTIONS
- **Plain `.ts` only** — no `.tsx` in this dir; keep it that way.
- **Context naming is inconsistent (legacy)**: most use `<Name>StoreContext`; `FontStore`/`SelectedIndexStore` use `<Name>Context`. New stores: prefer `<Name>StoreContext`.
- **Demo* impls** exist for TokenStore, EmotesStore, ReelStore, GamesStore — mock variants for Storybook/demo.
- **`use*Store` hooks** (e.g. `useVariableStore`) are the consumer API where present; otherwise consume via context.
- **EmotesStore owns 7TV integration**: `SEVENTV_QUERY`/`SEVENTV_CHANNEL_QUERY` GraphQL + `SEVENTV_CDN` URL builder — the only store doing external API calls.
- **ErrorStore.initGlobalErrorStore** wires `window.onerror`/`onunhandledrejection` — called once from `index.tsx`; keep enabled.
- **BotStore is a domain bundle**, not a pure store: exports `Bot`, `MaxButton`, `Announcer` classes + `BotStore implements Loadable`.
- **NewsStore/AppStore have no context** — plain `Default*` classes, consumed directly.

## ANTI-PATTERNS
- **Do NOT add `.tsx` stores** — plain `.ts` only (parent rule, enforced here).
- **Do NOT add new external API calls to stores** — EmotesStore's 7TV GraphQL is the established exception; new integrations belong in workers or services.
- **Do NOT rename existing contexts** (`FontContext`, `SelectedIndexContext`) — legacy names are referenced across the app.
- **Do NOT disable global error handling** — `initGlobalErrorStore` wiring in `index.tsx` must stay active.