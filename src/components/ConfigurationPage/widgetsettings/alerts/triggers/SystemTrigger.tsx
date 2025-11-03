import { makeAutoObservable } from "mobx";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";
import { ReactNode } from "react";
import { Select } from "antd";

export const SYSTEM_TRIGGER = {
  description: "донат сделан через",
  type: "system",
};

export class SystemTrigger implements Trigger {
  type = SYSTEM_TRIGGER;
  system: string = "";

  constructor(system?: string) {
    if (system) {
      this.system = system;
    }
    makeAutoObservable(this);
  }

  isTriggered(event: DonationEvent): boolean {
    return false;
  }

  public compare(other: Trigger): number {
    return 0;
  }

  markup(): ReactNode {
    return (
      <div style={{ display: "inline-block", width: "50%" }}>
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
