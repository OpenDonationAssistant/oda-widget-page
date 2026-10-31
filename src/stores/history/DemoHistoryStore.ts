import { HistoryItem, HistoryStore } from "./HistoryStore";

export class DemoHistoryStore implements HistoryStore {
  today: string = "";
  load = () => Promise.resolve();
  next = () => Promise.resolve();
  hasNext = () => false;
  loadUntil = (count: number) => Promise.resolve();
  alert = (item: HistoryItem) => Promise.resolve();
  export = () => Promise.resolve();
  pageSize: number = 20;
  pageNumber: number = 1;
  items: HistoryItem[] = [
    {
      id: "id",
      actions: [],
      originId: "id",
      amount: { major: 100, minor: 0, currency: "RUB" },
      nickname: "donater",
      system: "ODA",
      event: "payment",
      count: 0,
      levelName: "",
      goals: [],
      rouletteResults: [],
      message: "some comment about your wife",
      attachments: [],
      timestamp: new Date(),
      date: "",
      time: "",
      active: false,
    },
    {
      id: "id-2",
      originId: "id-2",
      amount: { major: 200, minor: 0, currency: "RUB" },
      nickname: "streamer",
      system: "ODA",
      event: "payment",
      count: 0,
      levelName: "",
      goals: [],
      rouletteResults: [],
      message: "another great comment",
      attachments: [],
      actions: [],
      timestamp: new Date(),
      date: "",
      time: "",
      active: false,
    },
  ];
  isRefreshing = false;
  showODA = true;
  showDonationAlerts = true;
  showDonatePay = true;
  showDonatePayEu = true;
  showDonateStream = true;
  showDonateX = true;
  showTribute = true;
  showBoostySubs = true;
  showBoostyFollows = true;
  showMemeAlertsCoins = true;
  showTwitchFollows = true;
  showTwitchRaids = true;
  showTwitchCheers = true;
  showTwitchSubs = true;
  showTwitchSubGifts = true;
  showKickFollows = true;
  showKickGifts = true;
  showKickSubs = true;
  showKickSubGifts = true;
  showVKLiveFollows = true;
  showVKLiveSubs = true;
  after: Date | null = null;
  before: Date | null = null;
}
