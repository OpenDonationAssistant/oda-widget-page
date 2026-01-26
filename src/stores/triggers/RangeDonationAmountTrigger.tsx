import { makeAutoObservable } from "mobx";
import {
  TriggerCause,
  Trigger,
  DonationTriggerCause,
} from "./AlertTriggerInterface";
import { ReactNode } from "react";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";

export const RANDE_DONATION_AMOUNT_TRIGGER = {
  description: "сумма больше или равна",
  type: "at-least-donation-amount",
  category: "donation",
};

export class RangeDonationAmountTrigger implements Trigger {
  type = RANDE_DONATION_AMOUNT_TRIGGER.type;
  category = "donation";
  description = RANDE_DONATION_AMOUNT_TRIGGER.description;
  min: number = 0;

  constructor(amount?: number) {
    if (amount) {
      this.min = amount;
    }
    makeAutoObservable(this);
  }

  priorityFor(event: TriggerCause): number {
    if (event.type !== "donation") {
      return -1;
    }
    return (event as DonationTriggerCause).amount.major - this.min;
  }

  public markup(): ReactNode {
    return (
      <div style={{ width: "100%" }}>
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
