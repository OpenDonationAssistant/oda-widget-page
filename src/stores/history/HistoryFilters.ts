export type HistoryPeriod = "day" | "week" | "month" | "all" | "custom";

export type HistoryPeriodUnit = "hour" | "day" | "week" | "month";

export interface HistoryCustomPeriod {
  amount: number;
  unit: HistoryPeriodUnit;
}

export interface HistoryFiltersFlags {
  showODA: boolean;
  showDonationAlerts: boolean;
  showDonatePay: boolean;
  showDonatePayEu: boolean;
  showDonateStream: boolean;
  showDonateX: boolean;
  showTribute: boolean;
  showBoostySubs: boolean;
  showBoostyFollows: boolean;
  showMemeAlertsCoins: boolean;
  showTwitchFollows: boolean;
  showTwitchRaids: boolean;
  showTwitchCheers: boolean;
  showTwitchSubs: boolean;
  showTwitchSubGifts: boolean;
  showKickFollows: boolean;
  showKickGifts: boolean;
  showKickSubs: boolean;
  showKickSubGifts: boolean;
  showVKLiveFollows: boolean;
  showVKLiveSubs: boolean;
}

export interface HistoryFilters extends HistoryFiltersFlags {
  period?: HistoryPeriod;
  customPeriod?: HistoryCustomPeriod;
}

export type HistoryFilterFlag = keyof HistoryFiltersFlags;

interface HistoryFilterDefinitionSource {
  key: HistoryFilterFlag;
  system: string;
  event: string;
  label: string;
  group: string;
}

export const HISTORY_FILTER_DEFINITIONS = [
  {
    key: "showODA",
    system: "ODA",
    event: "payment",
    label: "ODA",
    group: "donations",
  },
  {
    key: "showDonationAlerts",
    system: "DonationAlerts",
    event: "payment",
    label: "DonationAlerts",
    group: "donations",
  },
  {
    key: "showDonatePay",
    system: "DonatePay",
    event: "payment",
    label: "DonatePay.ru",
    group: "donations",
  },
  {
    key: "showDonatePayEu",
    system: "DonatePay.eu",
    event: "payment",
    label: "DonatePay.eu",
    group: "donations",
  },
  {
    key: "showDonateStream",
    system: "Donate.Stream",
    event: "payment",
    label: "Donate.Stream",
    group: "donations",
  },
  {
    key: "showDonateX",
    system: "DonateX",
    event: "payment",
    label: "DonateX",
    group: "donations",
  },
  {
    key: "showTribute",
    system: "Tribute",
    event: "payment",
    label: "Tribute",
    group: "donations",
  },
  {
    key: "showMemeAlertsCoins",
    system: "MemeAlerts",
    event: "payment",
    label: "history-toggle-meme-alerts-purchases",
    group: "memealerts",
  },
  {
    key: "showBoostySubs",
    system: "Boosty",
    event: "subscription",
    label: "history-filter-subscriptions",
    group: "boosty",
  },
  {
    key: "showBoostyFollows",
    system: "Boosty",
    event: "follow",
    label: "history-filter-tracking",
    group: "boosty",
  },
  {
    key: "showTwitchFollows",
    system: "Twitch",
    event: "follow",
    label: "history-filter-followers",
    group: "twitch",
  },
  {
    key: "showTwitchRaids",
    system: "Twitch",
    event: "raid",
    label: "history-filter-raids",
    group: "twitch",
  },
  {
    key: "showTwitchCheers",
    system: "Twitch",
    event: "cheer",
    label: "history-filter-cheers",
    group: "twitch",
  },
  {
    key: "showTwitchSubs",
    system: "Twitch",
    event: "subscription",
    label: "history-filter-subscriptions",
    group: "twitch",
  },
  {
    key: "showTwitchSubGifts",
    system: "Twitch",
    event: "subscription-gift",
    label: "history-filter-gifted-subscriptions",
    group: "twitch",
  },
  {
    key: "showKickFollows",
    system: "Kick",
    event: "follow",
    label: "history-filter-followers",
    group: "kick",
  },
  {
    key: "showKickGifts",
    system: "Kick",
    event: "kick-gift",
    label: "history-filter-gifts",
    group: "kick",
  },
  {
    key: "showKickSubs",
    system: "Kick",
    event: "subscription",
    label: "history-filter-subscriptions",
    group: "kick",
  },
  {
    key: "showKickSubGifts",
    system: "Kick",
    event: "subscription-gift",
    label: "history-filter-gifted-subscriptions",
    group: "kick",
  },
  {
    key: "showVKLiveFollows",
    system: "VKLive",
    event: "follow",
    label: "history-filter-followers",
    group: "vklive",
  },
  {
    key: "showVKLiveSubs",
    system: "VKLive",
    event: "subscription",
    label: "history-filter-subscriptions",
    group: "vklive",
  },
] as const satisfies readonly HistoryFilterDefinitionSource[];

export type HistoryFilterDefinition =
  (typeof HISTORY_FILTER_DEFINITIONS)[number];

export type HistoryFilterGroupKey = HistoryFilterDefinition["group"];

const HISTORY_FILTER_GROUP_TITLES: Record<HistoryFilterGroupKey, string> = {
  donations: "history-group-donations",
  memealerts: "history-group-meme-alerts",
  boosty: "history-group-boosty",
  twitch: "history-group-twitch",
  kick: "history-group-kick",
  vklive: "history-group-vk-live",
};

export const HISTORY_FILTER_GROUPS = Array.from(
  new Set(HISTORY_FILTER_DEFINITIONS.map((definition) => definition.group)),
).map((key) => ({ key, title: HISTORY_FILTER_GROUP_TITLES[key] }));

const filtersBySystemAndEvent = new Map(
  HISTORY_FILTER_DEFINITIONS.map((definition) => [
    `${definition.system}:${definition.event}`,
    definition,
  ]),
);

export const HISTORY_PERIOD_OPTIONS: { label: string; value: HistoryPeriod }[] =
  [
    { label: "history-period-day", value: "day" },
    { label: "history-period-week", value: "week" },
    { label: "history-period-month", value: "month" },
    { label: "history-period-all", value: "all" },
    { label: "history-period-custom", value: "custom" },
  ];

export const HISTORY_PERIOD_UNIT_OPTIONS: {
  label: string;
  value: HistoryPeriodUnit;
}[] = [
  { label: "history-period-unit-hours", value: "hour" },
  { label: "history-period-unit-days", value: "day" },
  { label: "history-period-unit-weeks", value: "week" },
  { label: "history-period-unit-months", value: "month" },
];

const HISTORY_PERIOD_DURATIONS: Record<
  Exclude<HistoryPeriod, "all" | "custom">,
  number
> = {
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
};

const HISTORY_PERIOD_UNIT_DURATIONS: Record<HistoryPeriodUnit, number> = {
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
};

export function defaultHistoryFilters(): HistoryFilters {
  return {
    showODA: true,
    showDonationAlerts: true,
    showDonatePay: true,
    showDonatePayEu: true,
    showDonateStream: true,
    showDonateX: true,
    showTribute: true,
    showBoostySubs: true,
    showBoostyFollows: true,
    showMemeAlertsCoins: true,
    showTwitchFollows: true,
    showTwitchRaids: true,
    showTwitchCheers: true,
    showTwitchSubs: true,
    showTwitchSubGifts: true,
    showKickFollows: true,
    showKickGifts: true,
    showKickSubs: true,
    showKickSubGifts: true,
    showVKLiveFollows: true,
    showVKLiveSubs: true,
    period: "day",
    customPeriod: { amount: 1, unit: "day" },
  };
}

export function historyPeriodStart(
  period: HistoryPeriod | null | undefined,
  customPeriod?: HistoryCustomPeriod | null,
  now: Date = new Date(),
): Date | null {
  if (!period || period === "all") {
    return null;
  }
  if (period === "custom") {
    if (!customPeriod) {
      return null;
    }
    return new Date(now.getTime() - customPeriodDuration(customPeriod));
  }
  return new Date(now.getTime() - HISTORY_PERIOD_DURATIONS[period]);
}

function customPeriodDuration(customPeriod: HistoryCustomPeriod): number {
  const amount =
    Number.isFinite(customPeriod.amount) && customPeriod.amount > 0
      ? customPeriod.amount
      : 1;
  const unit =
    HISTORY_PERIOD_UNIT_DURATIONS[customPeriod.unit] ??
    HISTORY_PERIOD_UNIT_DURATIONS.day;
  return amount * unit;
}

export interface HistoryFilterableItem {
  system?: string | null;
  event?: string | null;
  timestamp?: Date | string | null;
}

export function matchesHistoryFilters(
  item: HistoryFilterableItem,
  filters: HistoryFilters,
  now: Date = new Date(),
): boolean {
  const definition = filtersBySystemAndEvent.get(
    `${item.system}:${item.event}`,
  );
  if (definition && !filters[definition.key]) {
    return false;
  }

  const periodStart = historyPeriodStart(
    filters.period,
    filters.customPeriod,
    now,
  );
  if (periodStart && item.timestamp) {
    const timestamp =
      item.timestamp instanceof Date
        ? item.timestamp
        : new Date(item.timestamp);
    if (
      !Number.isNaN(timestamp.getTime()) &&
      timestamp.getTime() < periodStart.getTime()
    ) {
      return false;
    }
  }

  return true;
}
