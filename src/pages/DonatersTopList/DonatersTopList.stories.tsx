import type { Meta, StoryObj } from "@storybook/react";
import { DonatersTopList } from "./DonatersTopList";
import {
  createMockSettings,
  createMockTopListStore,
  createEmptyTopListStore,
  createMockHistoryStore,
  createMockHistoryItems,
} from "./DonatersTopList.test-utils";

const meta: Meta<typeof DonatersTopList> = {
  title: "Widgets/DonatersTopList",
  component: DonatersTopList,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "400px",
          height: "300px",
          padding: "16px",
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
type Story = StoryObj<typeof DonatersTopList>;

/* ────────────────────────────────────────────────
   Default — Top 5 donators, vertical, header on
   ──────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    settings: createMockSettings(),
    topListStore: createMockTopListStore(),
    historyStore: createMockHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   LastDonations — "Last" type, reads from history
   ──────────────────────────────────────────────── */
export const LastDonations: Story = {
  args: {
    settings: createMockSettings({
      type: "Last",
      period: "day",
      topsize: 3,
    }),
    topListStore: createEmptyTopListStore(),
    historyStore: createMockHistoryStore(),
  },
};

/* ────────────────────────────────────────────────
   WithCarousel — carousel paging through donators
   ──────────────────────────────────────────────── */
export const WithCarousel: Story = {
  args: {
    settings: createMockSettings({
      topsize: 8,
      carouselEnabled: true,
      customCarousel: {
        amount: 3,
        delay: 4,
        speed: 0.5,
        inAnimation: "flipInY",
        outAnimation: "fadeOut",
      },
    }),
    topListStore: createMockTopListStore([
      { nickname: "alpha", amount: 50000 },
      { nickname: "beta", amount: 30000 },
      { nickname: "gamma", amount: 10000 },
      { nickname: "delta", amount: 5000 },
      { nickname: "epsilon", amount: 2000 },
      { nickname: "zeta", amount: 1000 },
      { nickname: "eta", amount: 500 },
      { nickname: "theta", amount: 100 },
    ]),
    historyStore: createMockHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   HorizontalLayout — items side-by-side
   ──────────────────────────────────────────────── */
export const HorizontalLayout: Story = {
  args: {
    settings: createMockSettings({
      layout: "horizontal",
      topsize: 4,
    }),
    topListStore: createMockTopListStore([
      { nickname: "alpha", amount: 50000 },
      { nickname: "beta", amount: 30000 },
      { nickname: "gamma", amount: 10000 },
      { nickname: "delta", amount: 5000 },
    ]),
    historyStore: createMockHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   CustomStyling — custom background, borders,
   rounded corners, padding, and box-shadows
   ──────────────────────────────────────────────── */
export const CustomStyling: Story = {
  args: {
    settings: createMockSettings({
      title: "🎯 Top Donaters",
    }),
    topListStore: createMockTopListStore([
      { nickname: "whale", amount: 100000 },
      { nickname: "dolphin", amount: 50000 },
      { nickname: "seal", amount: 25000 },
    ]),
    historyStore: createMockHistoryStore([]),
  },
  render: (args) => (
    <DonatersTopList
      {...args}
      settings={
        {
          ...args.settings,
          backgroundColor: {
            calcCss: () => ({
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            }),
          },
          padding: { calcCss: () => ({ padding: "16px" }) },
          rounding: { calcCss: () => ({ borderRadius: "12px" }) },
          widgetBorder: {
            calcCss: () => ({
              border: "2px solid #e94560",
            }),
          },
          boxShadow: {
            calcCss: () => ({
              boxShadow: "0 8px 32px rgba(233, 69, 96, 0.3)",
            }),
            requiredHeight: 0,
            requiredWidth: 0,
          },
          titleBackgroundColor: {
            calcCss: () => ({
              background: "rgba(233, 69, 96, 0.15)",
            }),
          },
          headerBorder: {
            calcCss: () => ({
              borderBottom: "2px solid #e94560",
            }),
          },
          headerPadding: { calcCss: () => ({ padding: "8px 12px" }) },
          headerRounding: { calcCss: () => ({ borderRadius: "8px" }) },
          listBackgroundColor: {
            calcCss: () => ({
              background: "rgba(255, 255, 255, 0.05)",
            }),
          },
          listPadding: { calcCss: () => ({ padding: "8px" }) },
          listRounding: { calcCss: () => ({ borderRadius: "8px" }) },
          itemBackgroundColor: {
            calcCss: () => ({
              background: "rgba(233, 69, 96, 0.08)",
            }),
          },
          itemPadding: { calcCss: () => ({ padding: "6px 12px" }) },
          itemRounding: { calcCss: () => ({ borderRadius: "6px" }) },
          itemBorder: {
            calcCss: () => ({
              border: "1px solid rgba(233, 69, 96, 0.3)",
            }),
          },
          itemBoxShadow: {
            calcCss: () => ({
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }),
            requiredHeight: 0,
            requiredWidth: 0,
          },
          gap: 8,
        } as typeof args.settings
      }
    />
  ),
};

/* ────────────────────────────────────────────────
   HideEmpty — empty list, widget is invisible
   ──────────────────────────────────────────────── */
export const HideEmpty: Story = {
  args: {
    settings: createMockSettings({ hideEmpty: true }),
    topListStore: createEmptyTopListStore(),
    historyStore: createMockHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   EmptyVisible — empty list shown (no data)
   ──────────────────────────────────────────────── */
export const EmptyVisible: Story = {
  args: {
    settings: createMockSettings({ hideEmpty: false }),
    topListStore: createEmptyTopListStore(),
    historyStore: createMockHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   ManyDonaters — long list with many donators
   ──────────────────────────────────────────────── */
const manyDonaters = Array.from({ length: 20 }, (_, i) => ({
  nickname: `donater-${i + 1}`,
  amount: Math.round(100000 / (i + 1)),
}));

export const ManyDonaters: Story = {
  args: {
    settings: createMockSettings({ topsize: 20 }),
    topListStore: createMockTopListStore(manyDonaters),
    historyStore: createMockHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   NoHeader — header hidden
   ──────────────────────────────────────────────── */
export const NoHeader: Story = {
  args: {
    settings: createMockSettings({ showHeader: false }),
    topListStore: createMockTopListStore([
      { nickname: "alpha", amount: 1000 },
      { nickname: "beta", amount: 750 },
      { nickname: "gamma", amount: 500 },
    ]),
    historyStore: createMockHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   SingleItem — only one donator in the list
   ──────────────────────────────────────────────── */
export const SingleItem: Story = {
  args: {
    settings: createMockSettings(),
    topListStore: createMockTopListStore([
      { nickname: "only-donater", amount: 99999 },
    ]),
    historyStore: createMockHistoryStore([]),
  },
};

/* ────────────────────────────────────────────────
   DarkTheme — fully themed dark variant
   ──────────────────────────────────────────────── */
export const DarkTheme: Story = {
  args: {
    settings: createMockSettings({
      title: "⭐ Top Donaters",
    }),
    topListStore: createMockTopListStore([
      { nickname: "🐳 Whale", amount: 200000 },
      { nickname: "🦈 Shark", amount: 150000 },
      { nickname: "🐬 Dolphin", amount: 75000 },
      { nickname: "🐟 Fish", amount: 10000 },
    ]),
    historyStore: createMockHistoryStore([]),
  },
  render: (args) => (
    <DonatersTopList
      {...args}
      settings={
        {
          ...args.settings,
          backgroundColor: {
            calcCss: () => ({ background: "#0d0d0d" }),
          },
          widgetBorder: {
            calcCss: () => ({ border: "1px solid #333" }),
          },
          padding: { calcCss: () => ({ padding: "20px" }) },
          rounding: { calcCss: () => ({ borderRadius: "8px" }) },
          boxShadow: {
            calcCss: () => ({
              boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
            }),
            requiredHeight: 0,
            requiredWidth: 0,
          },
          titleBackgroundColor: {
            calcCss: () => ({ background: "rgba(255,215,0,0.08)" }),
          },
          headerBorder: {
            calcCss: () => ({ borderBottom: "1px solid #ffd700" }),
          },
          headerPadding: { calcCss: () => ({ padding: "10px 14px" }) },
          headerRounding: { calcCss: () => ({ borderRadius: "6px" }) },
          listBackgroundColor: {
            calcCss: () => ({ background: "transparent" }),
          },
          itemBackgroundColor: {
            calcCss: () => ({ background: "rgba(255,255,255,0.04)" }),
          },
          itemPadding: { calcCss: () => ({ padding: "8px 14px" }) },
          itemRounding: { calcCss: () => ({ borderRadius: "4px" }) },
          itemBorder: {
            calcCss: () => ({ border: "1px solid rgba(255,215,0,0.15)" }),
          },
          gap: 6,
        } as typeof args.settings
      }
    />
  ),
};
