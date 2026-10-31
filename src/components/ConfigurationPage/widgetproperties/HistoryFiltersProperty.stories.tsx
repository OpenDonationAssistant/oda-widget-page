import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { Flex } from "antd";
import { HistoryFiltersProperty } from "./HistoryFiltersProperty";
import type { HistoryFilters } from "../../../stores/history";

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

const PropertyPreview = observer(
  ({ value }: { value?: Partial<HistoryFilters> }) => {
    const [property] = useState(() => new HistoryFiltersProperty({ value }));
    return (
      <Flex
        vertical
        gap={16}
        style={{
          width: "560px",
          padding: "24px",
          borderRadius: "12px",
          background: "#1b1b1f",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {property.markup()}
        <pre
          style={{
            margin: 0,
            padding: "12px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.06)",
            fontSize: "11px",
            lineHeight: 1.4,
            opacity: 0.85,
          }}
        >
          {JSON.stringify(toJS(property.value), null, 2)}
        </pre>
      </Flex>
    );
  },
);

const meta: Meta<typeof PropertyPreview> = {
  title: "Configuration/HistoryFiltersProperty",
  component: PropertyPreview,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          "Property-редактор фильтров истории: период (включая свой период " +
          "с количеством и единицей измерения) и события по системам " +
          "(донаты, Twitch, Kick, VK Live, Boosty, Meme Alerts). Значение " +
          "передаётся в DefaultHistoryStore как HistoryConfiguration.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PropertyPreview>;

/* ────────────────────────────────────────────────
   Default — all systems and events enabled,
   sliding day period
   ──────────────────────────────────────────────── */
export const Default: Story = {
  args: {},
};

/* ────────────────────────────────────────────────
   DonationsOnly — only payment events are queried
   ──────────────────────────────────────────────── */
export const DonationsOnly: Story = {
  args: {
    value: paymentsOnly,
  },
};

/* ────────────────────────────────────────────────
   TwitchOnly — only Twitch follow/raid/cheer/
   subscription events are queried
   ──────────────────────────────────────────────── */
export const TwitchOnly: Story = {
  args: {
    value: twitchOnly,
  },
};

/* ────────────────────────────────────────────────
   MonthPeriod — same filters, sliding month window
   ──────────────────────────────────────────────── */
export const MonthPeriod: Story = {
  args: {
    value: { period: "month" },
  },
};

/* ────────────────────────────────────────────────
   CustomPeriod — amount + unit inputs are shown
   when "Свой период" is selected
   ──────────────────────────────────────────────── */
export const CustomPeriod: Story = {
  args: {
    value: {
      period: "custom",
      customPeriod: { amount: 12, unit: "hour" },
    },
  },
};
