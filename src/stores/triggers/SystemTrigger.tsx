import { makeAutoObservable } from "mobx";
import { TriggerCause, Trigger, DonationTriggerCause } from "./AlertTriggerInterface";
import { ReactNode } from "react";
import { Select } from "antd";

export const SYSTEM_TRIGGER = {
  description: "донат сделан через",
  type: "system",
  category: "donation",
};

export class SystemTrigger implements Trigger {
  type = SYSTEM_TRIGGER.type;
  category = "donation";
  description = SYSTEM_TRIGGER.description;
  system: string = "";

  constructor(system?: string) {
    if (system) {
      this.system = system;
    }
    makeAutoObservable(this);
  }

  priorityFor(event: TriggerCause): number {
    if (event.type !== "donation") {
      return -1;
    }
    return (event as DonationTriggerCause).system  == this.system ? 0 : -1;
  }

  markup(): ReactNode {
    return (
      <div style={{ width: "100%" }}>
        <Select
          value={this.system}
          style={{ width: "100%" }}
          options={[
            { value: "ODA", label: "ODA" },
            { value: "DonationAlerts", label: "DonationAlerts" },
            { value: "DonatePay.ru", label: "DonatePay.ru" },
            { value: "DonatePay.eu", label: "DonatePay.eu" },
          ]}
          onChange={(newValue) => {
            this.system = newValue;
          }}
        />
      </div>
    );
  }
}
