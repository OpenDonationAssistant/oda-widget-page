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
    label: "Покупки Meme Alerts",
    group: "memealerts",
  },
  {
    key: "showBoostySubs",
    system: "Boosty",
    event: "subscription",
    label: "Подписки",
    group: "boosty",
  },
  {
    key: "showBoostyFollows",
    system: "Boosty",
    event: "follow",
    label: "Отслеживания",
    group: "boosty",
  },
  {
    key: "showTwitchFollows",
    system: "Twitch",
    event: "follow",
    label: "Фолловы",
    group: "twitch",
  },
  {
    key: "showTwitchRaids",
    system: "Twitch",
    event: "raid",
    label: "Рейды",
    group: "twitch",
  },
  {
    key: "showTwitchCheers",
    system: "Twitch",
    event: "cheer",
    label: "Чиры",
    group: "twitch",
  },
  {
    key: "showTwitchSubs",
    system: "Twitch",
    event: "subscription",
    label: "Подписки",
    group: "twitch",
  },
  {
    key: "showTwitchSubGifts",
    system: "Twitch",
    event: "subscription-gift",
    label: "Подаренные подписки",
    group: "twitch",
  },
  {
    key: "showKickFollows",
    system: "Kick",
    event: "follow",
    label: "Фолловы",
    group: "kick",
  },
  {
    key: "showKickGifts",
    system: "Kick",
    event: "kick-gift",
    label: "Подарки",
    group: "kick",
  },
  {
    key: "showKickSubs",
    system: "Kick",
    event: "subscription",
    label: "Подписки",
    group: "kick",
  },
  {
    key: "showKickSubGifts",
    system: "Kick",
    event: "subscription-gift",
    label: "Подаренные подписки",
    group: "kick",
  },
  {
    key: "showVKLiveFollows",
    system: "VKLive",
    event: "follow",
    label: "Фолловы",
    group: "vklive",
  },
  {
    key: "showVKLiveSubs",
    system: "VKLive",
    event: "subscription",
    label: "Подписки",
    group: "vklive",
  },
] as const satisfies readonly HistoryFilterDefinitionSource[];

export type HistoryFilterDefinition =
  (typeof HISTORY_FILTER_DEFINITIONS)[number];

export type HistoryFilterGroupKey = HistoryFilterDefinition["group"];

const HISTORY_FILTER_GROUP_TITLES: Record<HistoryFilterGroupKey, string> = {
  donations: "Донаты",
  memealerts: "Meme Alerts",
  boosty: "Boosty",
  twitch: "Twitch",
  kick: "Kick",
  vklive: "VK Live",
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
    { label: "Сутки", value: "day" },
    { label: "Неделя", value: "week" },
    { label: "Месяц", value: "month" },
    { label: "Все время", value: "all" },
    { label: "Задать", value: "custom" },
  ];

export const HISTORY_PERIOD_UNIT_OPTIONS: {
  label: string;
  value: HistoryPeriodUnit;
}[] = [
  { label: "Часы", value: "hour" },
  { label: "Дни", value: "day" },
  { label: "Недели", value: "week" },
  { label: "Месяцы", value: "month" },
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
