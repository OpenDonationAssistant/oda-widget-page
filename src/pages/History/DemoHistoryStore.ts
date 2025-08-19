import { HistoryItem, HistoryStore } from "./HistoryStore";

export class DemoHistoryStore implements HistoryStore{
    today: string = "";
    load(): void {}
    next(): void {}
    pageSize: number = 20;
    pageNumber: number = 0;
    items = [
      {
        originId: "id",
        amount: {major: 100, minor: 0, currency: "RUB"},
        nickname: "donater",
        system: "ODA",
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
        originId: "id-2",
        amount: {major: 200, minor: 0, currency: "RUB"},
        nickname: "streamer",
        system: "ODA",
        goals: [],
        rouletteResults: [],
        message: "another great comment",
        attachments: [],
        timestamp: new Date(),
        date: "",
        time: "",
        active: false,
      }
    ];
    isRefreshing = false;
    showODA = true;
    showDonationAlerts = true;
    showDonatePay = true;
    showDonatePayEu = true;
    showDonateStream = true;
}
