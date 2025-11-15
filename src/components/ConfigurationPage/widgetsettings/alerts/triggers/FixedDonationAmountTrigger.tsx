import { ReactNode } from "react";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";
import InputNumber from "../../../components/InputNumber";
import { makeAutoObservable } from "mobx";

export const FIXED_DONATION_AMOUNT_TRIGGER = {
  type: "fixed-donation-amount",
  description: "сумма равна",
};

export class FixedDonationAmountTrigger implements Trigger {
  type = FIXED_DONATION_AMOUNT_TRIGGER.type;
  description = FIXED_DONATION_AMOUNT_TRIGGER.description;
  amount = 0;

  constructor(amount?: number) {
    if (amount) {
      this.amount = amount;
    }
    makeAutoObservable(this);
  }

  isTriggered(event: DonationEvent): boolean {
    return event.amount.major === this.amount;
  }

  public compare(other: Trigger): number {
    if (other instanceof FixedDonationAmountTrigger) {
      return this.amount - other.amount;
    }
    return 0;
  }

  public markup(): ReactNode {
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
  }
}
