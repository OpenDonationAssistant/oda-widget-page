# AGENTS.md — src/components/

**Generated:** 2026-09-11
**Scope:** `src/components/` — 230 files, 36 subdirs

## OVERVIEW
Shared UI for oda-console: ConfigurationPage (widget config UI) + reusable components (Button, Modal, Wizard, MediaWidget, Panel, Renderer, etc.).

## STRUCTURE
```
components/
├── ConfigurationPage/   # widget config UI (125 files) — see ConfigurationPage/AGENTS.md
│   ├── widgetproperties/  # ~48 property editors, one per widget setting
│   ├── widgetsettings/    # per-widget settings panels (alerts/ + triggers/)
│   ├── settings/ + css/   # FontSelect + LEGACY plain CSS
│   └── components/        # shared property inputs
├── MediaWidget/         # 18 files: video/audio player + colocated types
├── Button/              # 12 files: Button, UtilityButton, SaveButtons, Primary/Secondary
├── Wizard/              # wizard shell
├── Renderer/            # TextRenderer
└── ~30 smaller dirs     # Cards, Modal, Panel, PlayerInfo, PlayerControl, Popup, Tabs, List, Loading, Menu, Overlay, Element, ErrorBoundary, ErrorPopup, WarningsPanel, ConnectionErrorsPanel, DateTimeInput, Textarea, LabeledContainer, LabeledSwitch, SmallLabeledContainer, RenamableLabel, IconButton, ModalButton, PlayerPopup, TestAlertPopup, FontImport, ODALogo, SlideShow, ConnectedServices, Experimental
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Widget configuration UI | `ConfigurationPage/` — see its AGENTS.md |
| Property editors | `ConfigurationPage/widgetproperties/` |
| Widget settings panels | `ConfigurationPage/widgetsettings/` |
| Video/audio widget | `MediaWidget/` (VideoJSComponent.tsx) |
| Buttons | `Button/` (Button, UtilityButton, SaveButtons), `IconButton/`, `ModalButton/` |
| Wizards | `Wizard/`, `ConfigurationPage/AddWidgetWizard.tsx` |
| Text rendering | `Renderer/` |
| Modals / popups | `Modal/`, `Popup/`, `PlayerPopup/`, `TestAlertPopup/`, `ErrorPopup/` |
| Panels | `Panel/`, `WarningsPanel/`, `ConnectionErrorsPanel/` |
| Inputs | `DateTimeInput/`, `Textarea/`, `LabeledContainer/`, `LabeledSwitch/`, `SmallLabeledContainer/`, `RenamableLabel/` (EditableString) |
| Player controls | `PlayerControl/`, `PlayerInfo/` |
| Misc shared | `Tabs/`, `List/`, `Loading/`, `Menu/`, `Overlay/`, `Element/`, `ErrorBoundary/`, `FontImport/`, `ODALogo/`, `SlideShow/`, `ConnectedServices/`, `Experimental/` |

## CONVENTIONS
- MediaWidget colocated types: `types.ts`, `IPlayer.ts`, `IPlaylist.ts` — player interfaces live with the component.
- Property editors / settings panels follow ConfigurationPage conventions (see `ConfigurationPage/AGENTS.md`).
- `utils.ts` at components root — shared helpers.

## ANTI-PATTERNS
- **Do NOT casually patch `MediaWidget/VideoJSComponent.tsx`** — known type errors (VideoJsPlayerOptions import, VK global, Player type mismatch) + `// TODO: NPE` on `player.setVolume` (line 215); fix deliberately with video.js types.
- **Do NOT re-enable the COMMANDSREWARDS entry in `ConfigurationPage/Toolbar.tsx`** (lines 46-66 commented out) — CommandsStore/RewardsStore `load()`/`save()` are empty stubs; feature is non-functional.
- **Do NOT treat `Experimental/` as stable** — experimental components, expect churn.