import { makeAutoObservable } from "mobx";
import {
  TriggerCause,
  Trigger,
  DonationTriggerCause,
} from "./AlertTriggerInterface";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";

export const LESS_THAN_DONATION_AMOUNT_TRIGGER = {
  description: "сумма меньше",
  type: "less-than-donation-amount",
  category: "donation",
};

export class LessThanDonationAmountTrigger implements Trigger {
  type = LESS_THAN_DONATION_AMOUNT_TRIGGER.type;
  category = "donation";
  description = LESS_THAN_DONATION_AMOUNT_TRIGGER.description;
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
    return this.amount - (event as DonationTriggerCause).amount.major;
  }

  markup = () => {
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
  };
}
