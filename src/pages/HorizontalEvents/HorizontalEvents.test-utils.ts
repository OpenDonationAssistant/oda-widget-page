import {
  defaultHistoryFilters,
  HistoryFilters,
  HistoryFiltersFlags,
  HistoryItem,
  HistoryStore,
} from "../../stores/history";
import { HorizontalEventsWidgetSettings } from "./HorizontalEventsWidgetSettings";

let itemSequence = 0;

export interface HistoryItemParams {
  nickname?: string;
  system?: string;
  event?: string;
  amount?: number;
  message?: string;
  timestamp?: Date;
  count?: number;
}

export function createHistoryItem(
  params: HistoryItemParams = {},
): HistoryItem {
  itemSequence += 1;
  const id = `history-item-${itemSequence}`;
  return {
    id,
    originId: id,
    amount: { major: params.amount ?? 0, minor: 0, currency: "RUB" },
    nickname: params.nickname ?? "Аноним",
    system: params.system ?? "ODA",
    event: params.event ?? "payment",
    count: params.count ?? 0,
    levelName: "",
    goals: [],
    rouletteResults: [],
    message: params.message ?? "",
    attachments: [],
    actions: [],
    timestamp: params.timestamp ?? new Date(),
    date: "",
    time: "",
    active: false,
  };
}

export function createHistoryStore(items: HistoryItem[] = []): HistoryStore {
  const flags: HistoryFiltersFlags = defaultHistoryFilters();
  return {
    ...flags,
    today: "",
    load: () => Promise.resolve(),
    alert: () => Promise.resolve(),
    export: () => Promise.resolve(),
    loadUntil: () => Promise.resolve(),
    hasNext: () => false,
    next: () => Promise.resolve(),
    pageSize: 10,
    pageNumber: 0,
    items,
    isRefreshing: false,
    after: null,
    before: null,
  };
}

export function createHorizontalEventsSettings(
  overrides: Partial<HistoryFilters> = {},
): HorizontalEventsWidgetSettings {
  const settings = new HorizontalEventsWidgetSettings();
  settings.historyFilters.value = { ...defaultHistoryFilters(), ...overrides };
  return settings;
}

/** A mixed feed of donations, follows, raids, subs and gifts. */
export function createDemoHistoryItems(now: Date = new Date()): HistoryItem[] {
  const minutesAgo = (minutes: number) =>
    new Date(now.getTime() - minutes * 60 * 1000);

  return [
    createHistoryItem({
      nickname: "Алексей",
      system: "ODA",
      event: "payment",
      amount: 500,
      message: "Спасибо за стрим!",
      timestamp: minutesAgo(4),
    }),
    createHistoryItem({
      nickname: "Мария",
      system: "DonationAlerts",
      event: "payment",
      amount: 150,
      message: "На новый микрофон",
      timestamp: minutesAgo(8),
    }),
    createHistoryItem({
      nickname: "viewer123",
      system: "Twitch",
      event: "follow",
      timestamp: minutesAgo(12),
    }),
    createHistoryItem({
      nickname: "bigstreamer",
      system: "Twitch",
      event: "raid",
      amount: 25,
      timestamp: minutesAgo(16),
    }),
    createHistoryItem({
      nickname: "loyal_fan",
      system: "Twitch",
      event: "subscription",
      timestamp: minutesAgo(20),
    }),
    createHistoryItem({
      nickname: "kicker",
      system: "Kick",
      event: "kick-gift",
      amount: 10,
      timestamp: minutesAgo(24),
    }),
    createHistoryItem({
      nickname: "boosty_fan",
      system: "Boosty",
      event: "subscription",
      timestamp: minutesAgo(28),
    }),
  ];
}
