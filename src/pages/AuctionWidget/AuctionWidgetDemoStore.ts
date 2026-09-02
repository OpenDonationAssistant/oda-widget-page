import { AuctionWidgetStore } from "./AuctionWidgetStore";

export class AuctionWidgetDemoStore implements AuctionWidgetStore {
  public loadedAt = new Date().toISOString();

  public donations = [
    {
      id: "demo-1",
      nickname: "TheKennex",
      amount: 100,
      currency: "RUB",
      text: "Minecraft",
      timestamp: new Date().toISOString(),
      source: "oda" as const,
    },
    {
      id: "demo-2",
      nickname: "Bors",
      amount: 250,
      currency: "RUB",
      text: "майнкрафт",
      timestamp: new Date().toISOString(),
      source: "oda" as const,
    },
    {
      id: "demo-3",
      nickname: "Chat",
      amount: 50,
      currency: "RUB",
      text: "Terraria",
      timestamp: new Date().toISOString(),
      source: "oda" as const,
    },
  ];
}
