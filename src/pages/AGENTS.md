# src/pages/ — Widget Feature Modules

**29 widget dirs, 165 files.** Each dir is one streaming widget feature. Canonical file pattern documented in `AuctionWidget/README.md`.

## STRUCTURE

```
pages/
├── Alerts/           # largest widget — sections/ subdirs (AlertImage, FontLoader, MessageBody, MessageTitle)
├── Automation/       # AutomationAction/, AutomationTrigger/ subdirs
├── AuctionWidget/    # has own README.md (Russian)
├── ChatWidget/
├── ChatWidgetV2/     # v2 refactor
├── CommandsRewards/
├── CustomWidget/
├── DonatersTopList/  # has .test-utils.tsx + .stories.tsx
├── DonationGoal/     # has .test-utils.tsx + .stories.tsx
├── DonationTimer/
├── Donaton/          # note: NOT "Donation" — intentional spelling
├── EmoteWall/
├── History/
├── HorizontalEvents/
├── Integrations/
├── Login/
├── PlayerPopup/
├── Reel/
├── Roulette/
├── RutonyChat/
├── StreamCredits/
├── Api/
├── Bots/
├── Canvas/
├── Events/
├── Guides/
├── Account/
├── PaymentGatewaysConfiguration/
└── PaymentPageConfig/
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Complex widget logic | `Alerts/AlertController.ts` | 774+ lines — pre-moderation queue TODO |
| Widget data persistence | `History/HistoryStore.ts` | 592 lines — caching TODO |
| Payment flow | `Alerts/PaymentAlerts.tsx`, `PaymentGatewaysConfiguration/` | PaymentGatewayConfigurationStore.tsx large |
| Reference widget layout | `AuctionWidget/README.md` | Canonical dir structure (Russian) |
| Sub-component widgets | `Alerts/sections/`, `Automation/AutomationAction/` | Some widgets have internal sub-modules |

## CONVENTIONS

- Test coverage near-zero: only `DonationGoal/` and `DonatersTopList/` have `.test-utils.tsx` + `.stories.tsx`.
- Legacy `.tsx` stores without JSX exist (e.g., `CustomWidget/CustomWidgetStore.tsx`, `PaymentGatewayConfigurationStore.tsx`).

## ANTI-PATTERNS

- **AuctionWidgetPage.tsx imports a demo store** — real store is commented out. Production risk if shipped.
- **CommandsRewards `load()`/`save()` are empty stubs** — feature non-functional.
- **DonationGoalPage.tsx** exports `export default function DonatonPage()` — function name mismatches module.
- **ReelWidgetSettings.tsx** has hardcoded Russian string `"карт"` — needs i18n.
- **Do NOT add sub-component dirs** unless the widget has genuinely independent sub-features (only Alerts and Automation justify this).
