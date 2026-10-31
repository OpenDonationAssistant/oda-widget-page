import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { HorizontalEventsWidget } from "./HorizontalEventsWidget";
import {
  createDemoHistoryItems,
  createHistoryItem,
  createHistoryStore,
  createHorizontalEventsSettings,
} from "./HorizontalEvents.test-utils";
import type { HistoryFilters } from "../../stores/history";

const paymentsOnly: Partial<HistoryFilters> = {
  showBoostySubs: false,
  showBoostyFollows: false,
  showMemeAlertsCoins: false,
  showTwitchFollows: false,
  showTwitchRaids: false,
  showTwitchCheers: false,
  showTwitchSubs: false,
  showTwitchSubGifts: false,
  showKickFollows: false,
  showKickGifts: false,
  showKickSubs: false,
  showKickSubGifts: false,
  showVKLiveFollows: false,
  showVKLiveSubs: false,
};

const twitchOnly: Partial<HistoryFilters> = {
  showODA: false,
  showDonationAlerts: false,
  showDonatePay: false,
  showDonatePayEu: false,
  showDonateStream: false,
  showDonateX: false,
  showTribute: false,
  showMemeAlertsCoins: false,
  showBoostySubs: false,
  showBoostyFollows: false,
  showKickFollows: false,
  showKickGifts: false,
  showKickSubs: false,
  showKickSubGifts: false,
  showVKLiveFollows: false,
  showVKLiveSubs: false,
};

function createStyledSettings() {
  const settings = createHorizontalEventsSettings();
  settings.set("headerText", "Последние события:");
  settings.set("speed", 90);
  settings.set("showAmount", false);
  settings.eventsBackgroundColor.value = {
    angle: 0,
    colors: [{ color: "rgba(104, 74, 255, 0.35)" }],
    gradient: false,
    repeating: false,
    gradientType: 0,
  };
  settings.lineBackgroundColor.value = {
    angle: 0,
    colors: [{ color: "#0d0d0d" }],
    gradient: false,
    repeating: false,
    gradientType: 0,
  };
  return settings;
}

const meta: Meta<typeof HorizontalEventsWidget> = {
  title: "Widgets/HorizontalEvents",
  component: HorizontalEventsWidget,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          "Бегущая строка событий. События берутся из HistoryStore и фильтруются " +
          "настройкой HistoryFiltersProperty (системы, типы событий и период).",
      },
    },
  },
  decorators: [
    (Story: () => ReactNode) => (
      <div
        style={{
          width: "100vw",
          minHeight: "100vh",
          padding: "32px 24px",
          boxSizing: "border-box",
          background: "#121212",
          fontFamily: "sans-serif",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HorizontalEventsWidget>;

/* ────────────────────────────────────────────────
   Default — mixed events, all filters enabled
   ──────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    settings: createHorizontalEventsSettings(),
    store: createHistoryStore(createDemoHistoryItems()),
  },
};

/* ────────────────────────────────────────────────
   DonationsOnly — payments from all donation
   services, subscriptions/follows/gifts disabled
   ──────────────────────────────────────────────── */
export const DonationsOnly: Story = {
  args: {
    settings: createHorizontalEventsSettings({
      ...paymentsOnly,
      period: "day",
    }),
    store: createHistoryStore(createDemoHistoryItems()),
  },
};

/* ────────────────────────────────────────────────
   TwitchOnly — follows, raids, cheers, subs and
   gifted subs from Twitch only
   ──────────────────────────────────────────────── */
export const TwitchOnly: Story = {
  args: {
    settings: createHorizontalEventsSettings({
      ...twitchOnly,
      period: "day",
    }),
    store: createHistoryStore(createDemoHistoryItems()),
  },
};

/* ────────────────────────────────────────────────
   WeekPeriod — a three-day-old donation is hidden
   by the default day period, but shown for a week
   ──────────────────────────────────────────────── */
export const WeekPeriod: Story = {
  args: {
    settings: createHorizontalEventsSettings({ period: "week" }),
    store: createHistoryStore([
      ...createDemoHistoryItems(),
      createHistoryItem({
        nickname: "old_school",
        system: "ODA",
        event: "payment",
        amount: 1000,
        message: "Донат трёхдневной давности",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }),
    ]),
  },
};

/* ────────────────────────────────────────────────
   CustomPeriod — 12-hour window; a two-day-old
   donation is filtered out
   ──────────────────────────────────────────────── */
export const CustomPeriod: Story = {
  args: {
    settings: createHorizontalEventsSettings({
      period: "custom",
      customPeriod: { amount: 12, unit: "hour" },
    }),
    store: createHistoryStore([
      ...createDemoHistoryItems(),
      createHistoryItem({
        nickname: "two_days_ago",
        system: "ODA",
        event: "payment",
        amount: 300,
        message: "Донат двухдневной давности",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }),
    ]),
  },
};

/* ────────────────────────────────────────────────
   Empty — header only, no matching events
   ──────────────────────────────────────────────── */
export const Empty: Story = {
  args: {
    settings: createHorizontalEventsSettings(),
    store: createHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   CustomStyling — custom header, speed, colors
   ──────────────────────────────────────────────── */
export const CustomStyling: Story = {
  args: {
    settings: createStyledSettings(),
    store: createHistoryStore(createDemoHistoryItems()),
  },
};
