import { makeAutoObservable } from "mobx";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";
import InputNumber from "../../../components/InputNumber";

export const LESS_THAN_DONATION_AMOUNT_TRIGGER = {
  description: "сумма меньше",
  type: "less-than-donation-amount",
};

export class LessThanDonationAmountTrigger implements Trigger {
  type = LESS_THAN_DONATION_AMOUNT_TRIGGER;
  amount = 0;

  constructor(amount?: number) {
    if (amount) {
      this.amount = amount;
    }
    makeAutoObservable(this);
  }

  isTriggered(event: DonationEvent): boolean {
    return false;
  }

  public compare(other: Trigger): number {
    if (other instanceof LessThanDonationAmountTrigger) {
      return other.amount - this.amount;
    }
    return 0;
  }

  markup = () => {
    return (
      <div style={{ display: "inline-block", width: "50%" }}>
        <InputNumber
          value={this.amount}
          addon="руб."
          onChange={(newAmount) => {
            if (!newAmount) {
              return;
            }
            this.amount = newAmount;
          }}
        />
      </div>
    );
  };
}
