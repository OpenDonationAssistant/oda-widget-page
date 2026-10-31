/**
 * @jest-environment node
 */
import { subscribe } from "../../socket";
import { getHistory } from "@opendonationassistant/history-service";
import { defaultHistoryFilters, HistoryFilters } from "./HistoryFilters";
import { DefaultHistoryStore } from "./HistoryStore";

jest.mock("../../socket", () => ({
  subscribe: jest.fn(),
}));

jest.mock("../../logging", () => ({
  log: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock("../../utils", () => ({
  sleep: jest.fn(() => Promise.resolve()),
}));

jest.mock("@opendonationassistant/history-service", () => ({
  getHistory: jest.fn(),
  repeatAlert: jest.fn(),
  printCsv: jest.fn(),
  getCsvStatus: jest.fn(),
  downloadCsv: jest.fn(),
}));

const subscribeMock = subscribe as jest.Mock;
const getHistoryMock = getHistory as jest.Mock;

interface StompMessage {
  body: string;
  ack: () => void;
}

type MessageHandler = (message: StompMessage) => void;

function variables(values: Record<string, unknown>) {
  return Object.entries(values).map(([name, value]) => ({
    id: `${name}-id`,
    name,
    value,
    type: typeof value,
  }));
}

function paymentAlert(originId: string, amount: number) {
  return {
    id: "alert-id",
    type: "Alert",
    variables: variables({
      originId,
      amount: String(amount),
      nickname: "donater",
      message: "hello",
      system: "ODA",
      event: "payment",
      force: false,
    }),
  };
}

function apiRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "history-1",
    originId: "payment-1",
    type: "payment",
    system: "ODA",
    nickname: "donater",
    amount: { major: 100, minor: 0, currency: "RUB" },
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

async function createStore(
  filters: HistoryFilters = defaultHistoryFilters(),
  content: unknown[] = [],
) {
  getHistoryMock.mockResolvedValue({
    data: { content, totalSize: content.length },
  });
  const store = new DefaultHistoryStore(
    "token",
    "recipient",
    "widget",
    { topic: { events: "events", alertStatus: "alertStatus" } },
    filters,
  );
  // The subscription starts after the initial page has loaded.
  await new Promise((resolve) => setTimeout(resolve, 0));
  const handler = subscribeMock.mock.calls.find(
    ([, topic]) => topic === "events",
  )?.[2] as MessageHandler;
  return { store, handler };
}

function emit(handler: MessageHandler, payload: unknown) {
  const ack = jest.fn();
  handler({ body: JSON.stringify(payload), ack });
  return ack;
}

describe("DefaultHistoryStore realtime events", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("appends a matching event instead of reloading the history", async () => {
    const { store, handler } = await createStore();
    const loadCalls = getHistoryMock.mock.calls.length;

    const ack = emit(handler, paymentAlert("payment-1", 150));

    expect(store.items).toHaveLength(1);
    expect(store.items[0]).toMatchObject({
      id: "payment-1",
      originId: "payment-1",
      nickname: "donater",
      message: "hello",
      system: "ODA",
      event: "payment",
      amount: { major: 150, minor: 0, currency: "RUB" },
    });
    expect(store.items[0].date).not.toBe("");
    expect(store.items[0].time).not.toBe("");
    expect(getHistoryMock).toHaveBeenCalledTimes(loadCalls);
    expect(ack).toHaveBeenCalled();
  });

  it("maps platform events to their history system and event", async () => {
    const { store, handler } = await createStore();

    emit(handler, {
      id: "twitch-event-1",
      type: "TwitchChannelFollowEvent",
      variables: variables({ nickname: "follower" }),
    });

    expect(store.items).toHaveLength(1);
    expect(store.items[0]).toMatchObject({
      originId: "twitch-event-1",
      nickname: "follower",
      system: "Twitch",
      event: "follow",
    });
  });

  it("normalizes object messages from platform events", async () => {
    const { store, handler } = await createStore();

    emit(handler, {
      id: "sub-1",
      type: "TwitchChannelSubscribeEvent",
      variables: variables({
        nickname: "subscriber",
        message: { text: "resub text", emotes: [] },
      }),
    });

    expect(store.items).toHaveLength(1);
    expect(store.items[0].message).toBe("resub text");
  });

  it("skips events whose system/event pair is disabled", async () => {
    const { store, handler } = await createStore({
      ...defaultHistoryFilters(),
      showTwitchRaids: false,
    });

    emit(handler, {
      id: "raid-1",
      type: "TwitchChannelRaidEvent",
      variables: variables({ channel: "raider", viewerCount: 5 }),
    });

    expect(store.items).toHaveLength(0);
  });

  it("skips events that are not history items", async () => {
    const { store, handler } = await createStore();

    emit(handler, {
      id: "reel-result",
      type: "ReelResult",
      variables: variables({ widgetId: "reel", title: "123" }),
    });

    expect(store.items).toHaveLength(0);
  });

  it("does not append test or repeat alerts", async () => {
    const { store, handler } = await createStore();

    emit(handler, {
      id: "test-alert",
      type: "Alert",
      variables: variables({
        amount: "100",
        nickname: "Тестовый алерт",
        system: "ODA",
        event: "payment",
        force: true,
      }),
    });

    expect(store.items).toHaveLength(0);
  });

  it("does not append a row that was already loaded", async () => {
    const { store, handler } = await createStore(defaultHistoryFilters(), [
      apiRow(),
    ]);
    expect(store.items).toHaveLength(1);
    const loadCalls = getHistoryMock.mock.calls.length;

    emit(handler, paymentAlert("payment-1", 100));

    expect(store.items).toHaveLength(1);
    expect(getHistoryMock).toHaveBeenCalledTimes(loadCalls);
  });

  it("notifies listeners about appended items only", async () => {
    const { store, handler } = await createStore();
    const listener = { onHistoryItemAdded: jest.fn() };
    store.addListener(listener);

    emit(handler, paymentAlert("payment-1", 100));
    emit(handler, {
      id: "reel-result",
      type: "ReelResult",
      variables: variables({ widgetId: "reel", title: "123" }),
    });

    expect(listener.onHistoryItemAdded).toHaveBeenCalledTimes(1);
    expect(listener.onHistoryItemAdded).toHaveBeenCalledWith(
      expect.objectContaining({ originId: "payment-1" }),
    );
  });

  it("appends newest items first", async () => {
    const { store, handler } = await createStore();

    emit(handler, paymentAlert("payment-1", 100));
    emit(handler, paymentAlert("payment-2", 200));

    expect(store.items.map((item) => item.originId)).toEqual([
      "payment-2",
      "payment-1",
    ]);
  });
});
