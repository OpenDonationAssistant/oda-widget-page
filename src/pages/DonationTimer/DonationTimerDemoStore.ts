import { AbstractDonationTimerStore } from "./DonationTimerStore";

export class DonationTimerDemoStore implements AbstractDonationTimerStore {
  lastDonationTime = Date.now();
  updateDonationTime: () => void = () => {};
}
