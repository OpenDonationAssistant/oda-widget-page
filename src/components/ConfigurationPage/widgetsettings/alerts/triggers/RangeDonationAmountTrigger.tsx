import { makeAutoObservable } from "mobx";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";
import { ReactNode } from "react";
import InputNumber from "../../../components/InputNumber";

export const RANDE_DONATION_AMOUNT_TRIGGER = {
  description: "сумма больше или равна",
  type: "at-least-donation-amount",
};

export class RangeDonationAmountTrigger implements Trigger {
  type = RANDE_DONATION_AMOUNT_TRIGGER.type;
  description = RANDE_DONATION_AMOUNT_TRIGGER.description;
  min: number = 0;

  constructor(amount?: number) {
    if (amount) {
      this.min = amount;
    }
    makeAutoObservable(this);
  }

  isTriggered(event: DonationEvent): boolean {
    return event.amount.major >= this.min;
  }

  public compare(other: Trigger): number {
    if (other instanceof RangeDonationAmountTrigger) {
      return this.min - other.min;
    }
    return 0;
  }

  public markup(): ReactNode {
    return (
      <div style={{ display: "inline-block", width: "50%" }}>
        <InputNumber
          value={this.min}
          addon="руб."
          onChange={(newAmount) => {
            if (!newAmount) {
              return;
            }
            this.min = newAmount;
          }}
        />
      </div>
    );
  }
}
