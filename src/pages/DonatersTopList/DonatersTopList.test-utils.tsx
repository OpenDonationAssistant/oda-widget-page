import { CSSProperties, ReactNode } from "react";
import type { AbstractDonatersListStore } from "./DonatersListStore";
import type { HistoryStore } from "../History/HistoryStore";

/* ------------------------------------------------------------------ */
/*  Mock helpers for DonatersTopList settings, stores & history        */
/*  Uses structural typing (duck-typing) so any object matching the    */
/*  shape is accepted by the component.                                */
/* ------------------------------------------------------------------ */

/* ---------- Default CSS helper ---------- */

const emptyCss = (): CSSProperties => ({});
const resolvedPromiseCss = (): Promise<CSSProperties> =>
  Promise.resolve({});

/* ---------- Font mock ---------- */

export function createMockFont(
  overrides?: Partial<Record<string, unknown>>,
) {
  return {
    value: {
      family: "Roboto",
      size: 24,
      color: {
        gradient: false,
        gradientType: 0,
        repeating: false,
        colors: [{ color: "#ffffff" }],
        angle: 0,
      },
      outline: { enabled: false, width: 0, color: "#000000" },
      weight: false,
      italic: false,
      underline: false,
      shadows: [] as Array<{
        x: number;
        y: number;
        blur: number;
        color: string;
      }>,
      animation: "none",
      animationType: "entire",
      animationSpeed: "slow",
      ...overrides,
    },
    createFontImport: () => null as ReactNode,
  };
}

/* ---------- Carousel mock ---------- */

export function createMockCarousel(
  enabled = false,
  overrides?: Partial<{
    amount: number;
    delay: number;
    speed: number;
    inAnimation: string;
    outAnimation: string;
  }>,
) {
  return {
    value: {
      enabled,
      amount: 1,
      delay: 3,
      speed: 0.5,
      inAnimation: undefined as string | undefined,
      outAnimation: undefined as string | undefined,
      ...overrides,
    },
  };
}

/* ---------- Property mocks ---------- */

function mockProp(value?: unknown, css?: CSSProperties) {
  return {
    value,
    calcCss: css ? () => css : emptyCss,
  };
}

function mockAsyncProp() {
  return { calcCss: resolvedPromiseCss };
}

function mockBoxShadow() {
  return {
    calcCss: emptyCss,
    requiredHeight: 0,
    requiredWidth: 0,
  };
}

function mockDimension(enabled = false, px?: number) {
  return {
    value: enabled && px ? px : null,
    calcCss: enabled && px
      ? () => ({ width: `${px}px` } as CSSProperties)
      : emptyCss,
  };
}

/* ---------- Main settings factory ---------- */

export interface MockSettingsOverrides {
  type?: "Top" | "Last";
  period?: "month" | "day";
  topsize?: number;
  hideEmpty?: boolean;
  showHeader?: boolean;
  title?: string;
  layout?: "vertical" | "horizontal";
  gap?: number;
  headerAlignment?: "left" | "center" | "right";
  listAlignment?: "left" | "center" | "right";
  carouselEnabled?: boolean;
  customCarousel?: Partial<{
    amount: number;
    delay: number;
    speed: number;
    inAnimation: string;
    outAnimation: string;
  }>;
  widthEnabled?: boolean;
  widthPx?: number;
  heightEnabled?: boolean;
  heightPx?: number;
  fontOverrides?: Partial<Record<string, unknown>>;
}

export function createMockSettings(overrides?: MockSettingsOverrides) {
  const o = overrides ?? {};
  return {
    // --- scalar getters ---
    type: o.type ?? "Top",
    period: o.period ?? "month",
    topsize: o.topsize ?? 5,
    hideEmpty: o.hideEmpty ?? false,
    showHeader: o.showHeader ?? true,
    title: o.title ?? "Top Donators",
    layout: o.layout ?? "vertical",
    gap: o.gap ?? 0,
    headerAlignment: o.headerAlignment ?? "center",
    listAlignment: o.listAlignment ?? "center",

    // --- carousel ---
    carousel: createMockCarousel(o.carouselEnabled ?? false, o.customCarousel),

    // --- dimensions ---
    heightProperty: mockDimension(o.heightEnabled, o.heightPx),
    widthProperty: mockDimension(o.widthEnabled, o.widthPx),

    // --- background images (async) ---
    backgroundImage: mockAsyncProp(),
    headerBackgroundImage: mockAsyncProp(),
    listBackgroundImage: mockAsyncProp(),
    itemBackgroundImage: mockAsyncProp(),

    // --- colour properties ---
    backgroundColor: mockProp(),
    titleBackgroundColor: mockProp(),
    listBackgroundColor: mockProp(),
    itemBackgroundColor: mockProp(),

    // --- borders ---
    widgetBorder: mockProp(),
    headerBorder: mockProp(),
    listBorder: mockProp(),
    itemBorder: mockProp(),

    // --- rounding ---
    rounding: mockProp(),
    headerRounding: mockProp(),
    listRounding: mockProp(),
    itemRounding: mockProp(),

    // --- padding ---
    padding: mockProp(),
    headerPadding: mockProp(),
    listPadding: mockProp(),
    itemPadding: mockProp(),

    // --- box-shadows ---
    boxShadow: mockBoxShadow(),
    headerBoxShadow: mockBoxShadow(),
    listBoxShadow: mockBoxShadow(),
    itemBoxShadow: mockBoxShadow(),

    // --- header sizes ---
    headerWidth: mockDimension(),
    headerHeight: mockDimension(),

    // --- list sizes ---
    listWidth: mockDimension(),
    listHeight: mockDimension(),

    // --- item sizes ---
    itemWidth: mockDimension(),
    itemHeight: mockDimension(),

    // --- fonts ---
    messageFont: createMockFont(o.fontOverrides),
    headerFont: createMockFont(o.fontOverrides),
  };
}

/* ---------- Store mocks ---------- */

export interface MockDonaterRecord {
  nickname: string;
  amount: number;
}

export function createMockTopListStore(
  donaters?: MockDonaterRecord[],
): AbstractDonatersListStore {
  return {
    list: donaters ?? [
      { nickname: "donater #1", amount: 30000 },
      { nickname: "donater #2", amount: 2000 },
      { nickname: "donater #3", amount: 100 },
      { nickname: "donater #4", amount: 100 },
      { nickname: "donater #5", amount: 100 },
    ],
  };
}

export function createEmptyTopListStore(): AbstractDonatersListStore {
  return { list: [] };
}

export function createMockHistoryItems() {
  return [
    {
      id: "h-1",
      originId: "h-1",
      amount: { major: 500, minor: 0, currency: "RUB" },
      nickname: "recent-donater-1",
      system: "ODA",
      event: "payment",
      count: 0,
      levelName: "",
      goals: [],
      rouletteResults: [],
      message: "Great stream!",
      attachments: [],
      actions: [],
      timestamp: new Date(),
      date: "",
      time: "",
      active: false,
    },
    {
      id: "h-2",
      originId: "h-2",
      amount: { major: 1500, minor: 0, currency: "RUB" },
      nickname: "recent-donater-2",
      system: "DonationAlerts",
      event: "payment",
      count: 0,
      levelName: "",
      goals: [],
      rouletteResults: [],
      message: "Keep it up!",
      attachments: [],
      actions: [],
      timestamp: new Date(),
      date: "",
      time: "",
      active: false,
    },
    {
      id: "h-3",
      originId: "h-3",
      amount: { major: 250, minor: 0, currency: "RUB" },
      nickname: "recent-donater-3",
      system: "ODA",
      event: "payment",
      count: 0,
      levelName: "",
      goals: [],
      rouletteResults: [],
      message: "Hello!",
      attachments: [],
      actions: [],
      timestamp: new Date(Date.now() - 3600000),
      date: "",
      time: "",
      active: false,
    },
  ];
}

export function createMockHistoryStore(
  items?: ReturnType<typeof createMockHistoryItems>,
): HistoryStore {
  const historyItems = items ?? createMockHistoryItems();
  return {
    today: "",
    load: () => Promise.resolve(),
    alert: () => Promise.resolve(),
    export: () => Promise.resolve(),
    loadUntil: (_count: number) => Promise.resolve(),
    hasNext: () => false,
    next: () => Promise.resolve(),
    pageSize: 10,
    pageNumber: 0,
    items: historyItems,
    isRefreshing: false,
    showODA: true,
    showDonationAlerts: true,
    showDonatePay: true,
    showDonatePayEu: true,
    showDonateStream: true,
    showDonateX: true,
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
    after: null,
    before: null,
  };
}
