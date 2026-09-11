# ConfigurationPage — Widget Configuration UI

**Generated:** 2026-09-11
**Scope:** `src/components/ConfigurationPage/` (125 files)

## OVERVIEW
Widget configuration UI: page shell (ConfigurationPage, WidgetConfiguration, Header, Toolbar, Presets, Add/Delete widget modals) + per-widget settings panels and property editors.

## STRUCTURE
```
ConfigurationPage/
├── widgetproperties/   # ~48 property editors — one file per widget setting input
│   ├── AdvancedText/   # multi-file property (AdvancedTextProperty.tsx + subcomponents)
│   └── List/           # shared list-input components
├── widgetsettings/     # per-widget settings panels
│   ├── alerts/         # alert settings (23 files) + triggers/ (per-platform trigger editors)
│   ├── donaton/        # donaton panel (DonatonPriceProperty.tsx)
│   ├── canvas/         # canvas panel
│   └── media/          # media panel
├── settings/           # FontSelect.tsx
├── css/                # LEGACY plain CSS (Widget.css, WidgetSettings.css, WidgetButton.css)
└── components/         # shared inputs (BooleanPropertyInput, InputNumber)
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Add a property editor for a widget setting | `widgetproperties/<Setting>Property.tsx` — one component per input |
| Add a widget's settings panel | `widgetsettings/<Widget>WidgetSettings.tsx` |
| Alert settings / triggers | `widgetsettings/alerts/` + `alerts/triggers/` |
| Shared property inputs | `components/` (BooleanPropertyInput, InputNumber) |
| Property base class | `widgetproperties/WidgetProperty.tsx` |
| Settings panel base | `widgetsettings/AbstractWidgetSettings.tsx` |
| Font picker | `settings/FontSelect.tsx` |

## CONVENTIONS
- Property editor = one component per setting input, named `<Setting>Property.tsx`, consumed by the widget's settings panel.
- Property editors extend `WidgetProperty` (base class in `widgetproperties/WidgetProperty.tsx`); settings panels extend `AbstractWidgetSettings`.
- Complex properties get a colocated folder: `AdvancedText/AdvancedTextProperty.tsx`.
- Alerts use tabbed panels (`GeneralTab`, `HeaderTab`, `MessageTab`, `ImageTab`, `SoundTab`, `VoiceTab`) + per-platform trigger components in `triggers/` (`<Platform><Event>Trigger.tsx`).

## ANTI-PATTERNS (THIS DIR)
- **Do NOT add unlocalized strings** — many `// TODO: 18n` / `// TODO: локализовать` comments in widgetproperties/ and widgetsettings/ (DonationGoalProperty, BoxShadowProperty, DonatersTopListLabelProperty, DonationGoalLabelProperty, DonatersTopListCarouselProperty, DonatonPriceProperty, AdvancedTextProperty). Route strings through i18next.
- **Do NOT resurrect commented-out logic** — AbstractWidgetSettings.tsx (multi-section conditional), PaymentAlertsProperty.tsx (`super.deepEqual`), AdvancedTextProperty.tsx (pre-container branch) are dead code; delete, don't uncomment.

## NOTES
- `WidgetConfiguration.module.css` has `/* TODO: cleanup */` (line 168).
- `DonationGoalWidgetSettings.tsx` TODO: vertical content positioning to fit frame.
- `Alerts.tsx` has `// TODO: use store` — alert state not yet store-backed.