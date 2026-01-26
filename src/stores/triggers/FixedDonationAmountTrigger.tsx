import { ReactNode } from "react";
import {
  TriggerCause,
  Trigger,
  DonationTriggerCause,
} from "./AlertTriggerInterface";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import { makeAutoObservable } from "mobx";

export const FIXED_DONATION_AMOUNT_TRIGGER = {
  type: "fixed-donation-amount",
  description: "сумма равна",
  category: "donation",
};

export class FixedDonationAmountTrigger implements Trigger {
  type = FIXED_DONATION_AMOUNT_TRIGGER.type;
  category = "donation";
  description = FIXED_DONATION_AMOUNT_TRIGGER.description;
  amount = 0;

  constructor(amount?: number) {
    if (amount) {
      this.amount = amount;
    }
    makeAutoObservable(this);
  }

  priorityFor(event: TriggerCause): number {
    if (event.type !== "donation") {
      return -1;
    }
    return (event as DonationTriggerCause).amount.major === this.amount
      ? 0
      : -1;
  }

  public markup(): ReactNode {
    return (
      <div style={{ width: "100%" }}>
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
