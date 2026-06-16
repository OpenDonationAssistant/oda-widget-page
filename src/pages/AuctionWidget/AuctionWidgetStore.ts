export type AuctionDonation = {
  id: string;
  nickname: string;
  amount: number;
  currency: string;
  text: string;
  timestamp: string;
  source: "oda" | "manual";
};

export interface AuctionWidgetStore {
  donations: AuctionDonation[];
  loadedAt: string | null;
}

export class DefaultAuctionWidgetStore implements AuctionWidgetStore {
  public donations: AuctionDonation[] = [];
  public loadedAt: string | null = null;

  constructor(widgetId: string, conf: any) {
    void widgetId;
    void conf;
    // Тут потом надо подключить реальный ODA subscribe/history API.
    // Я оставил класс тонким, чтобы логика аукциона не смешивалась с транспортом платформы.
  }
}
