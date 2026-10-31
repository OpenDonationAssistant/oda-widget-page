import {
  defaultHistoryFilters,
  HistoryFilters,
  historyPeriodStart,
  matchesHistoryFilters,
} from "./HistoryFilters";

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;
const now = new Date("2026-10-30T12:00:00.000Z");

function withFilters(
  overrides: Partial<HistoryFilters> = {},
): HistoryFilters {
  return { ...defaultHistoryFilters(), ...overrides };
}

describe("historyPeriodStart", () => {
  it("returns null for the whole period", () => {
    expect(historyPeriodStart("all", undefined, now)).toBeNull();
    expect(historyPeriodStart(null, undefined, now)).toBeNull();
  });

  it("returns a sliding window for day/week/month", () => {
    expect(historyPeriodStart("day", undefined, now)?.getTime()).toBe(
      now.getTime() - DAY,
    );
    expect(historyPeriodStart("week", undefined, now)?.getTime()).toBe(
      now.getTime() - DAY * 7,
    );
    expect(historyPeriodStart("month", undefined, now)?.getTime()).toBe(
      now.getTime() - DAY * 30,
    );
  });

  it("returns a sliding window for a custom amount and unit", () => {
    expect(
      historyPeriodStart("custom", { amount: 6, unit: "hour" }, now)?.getTime(),
    ).toBe(now.getTime() - HOUR * 6);
    expect(
      historyPeriodStart("custom", { amount: 2, unit: "week" }, now)?.getTime(),
    ).toBe(now.getTime() - DAY * 14);
    expect(
      historyPeriodStart("custom", { amount: 3, unit: "month" }, now)?.getTime(),
    ).toBe(now.getTime() - DAY * 90);
  });

  it("returns null for a custom period without a value", () => {
    expect(historyPeriodStart("custom", undefined, now)).toBeNull();
  });
});

describe("matchesHistoryFilters", () => {
  it("matches enabled system/event pairs", () => {
    expect(
      matchesHistoryFilters(
        {
          system: "ODA",
          event: "payment",
          timestamp: new Date(now.getTime() - HOUR),
        },
        withFilters(),
        now,
      ),
    ).toBe(true);
  });

  it("hides disabled system/event pairs", () => {
    expect(
      matchesHistoryFilters(
        {
          system: "Twitch",
          event: "raid",
          timestamp: new Date(now.getTime() - HOUR),
        },
        withFilters({ showTwitchRaids: false }),
        now,
      ),
    ).toBe(false);
  });

  it("hides events outside of the configured period", () => {
    const oldPayment = {
      system: "ODA",
      event: "payment",
      timestamp: new Date(now.getTime() - DAY * 2),
    };
    expect(matchesHistoryFilters(oldPayment, withFilters(), now)).toBe(false);
    expect(
      matchesHistoryFilters(oldPayment, withFilters({ period: "week" }), now),
    ).toBe(true);
    expect(
      matchesHistoryFilters(oldPayment, withFilters({ period: "all" }), now),
    ).toBe(true);
  });

  it("hides events outside of a custom period", () => {
    const customFilters = withFilters({
      period: "custom",
      customPeriod: { amount: 12, unit: "hour" },
    });
    expect(
      matchesHistoryFilters(
        {
          system: "ODA",
          event: "payment",
          timestamp: new Date(now.getTime() - HOUR * 6),
        },
        customFilters,
        now,
      ),
    ).toBe(true);
    expect(
      matchesHistoryFilters(
        {
          system: "ODA",
          event: "payment",
          timestamp: new Date(now.getTime() - DAY * 2),
        },
        customFilters,
        now,
      ),
    ).toBe(false);
  });

  it("keeps unknown system/event pairs instead of hiding them", () => {
    expect(
      matchesHistoryFilters(
        {
          system: "NewPlatform",
          event: "new-event",
          timestamp: new Date(now.getTime() - HOUR),
        },
        withFilters(),
        now,
      ),
    ).toBe(true);
  });
});
