import { Flex, Select } from "antd";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { produce } from "immer";
import { Renderable } from "../../../utils";
import { AutomationTrigger } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import InputNumber from "../../../components/ConfigurationPage/components/InputNumber";

export interface DonationTriggerValue {
  system?: string;
  minAmount: number;
  maxAmount?: number;
}

const DONATION_SYSTEMS = [
  { label: "ODA", value: "ODA" },
  { label: "DonationAlerts", value: "DonationAlerts" },
  { label: "DonatePay", value: "DonatePay" },
  { label: "DonatePay.ru", value: "DonatePay.ru" },
  { label: "DonatePay.eu", value: "DonatePay.eu" },
  { label: "DonateX", value: "DonateX" },
  { label: "Tribute", value: "Tribute" },
  { label: "Donate.Stream", value: "Donate.Stream" },
];

const DonationTriggerComponent = observer(
  ({ trigger }: { trigger: DonationTrigger }) => {
    return (
      <Flex vertical gap={9}>
        <LabeledContainer displayName="Платформа">
          <Select
            className="full-width"
            allowClear
            placeholder="Любая платформа"
            value={trigger.value.system}
            options={DONATION_SYSTEMS}
            onChange={(system: string | undefined) => {
              trigger.value = produce(trigger.value, (draft) => {
                draft.system = system;
              });
            }}
          />
        </LabeledContainer>
        <LabeledContainer displayName="Минимальная сумма">
          <InputNumber
            value={trigger.value.minAmount ?? 0}
            onChange={(minAmount) => {
              trigger.value = produce(trigger.value, (draft) => {
                draft.minAmount = minAmount;
              });
            }}
          />
        </LabeledContainer>
        <LabeledContainer displayName="Максимальная сумма">
          <InputNumber
            className="full-width"
            value={trigger.value.maxAmount ?? 999999999}
            onChange={(maxAmount) => {
              trigger.value = produce(trigger.value, (draft) => {
                draft.maxAmount =
                  maxAmount === null ? undefined : Math.max(maxAmount, 0);
              });
            }}
          />
        </LabeledContainer>
      </Flex>
    );
  },
);

export class DonationTrigger implements AutomationTrigger, Renderable {
  private _value: DonationTriggerValue = {
    system: undefined,
    minAmount: 0,
    maxAmount: undefined,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public set value(value: DonationTriggerValue) {
    this._value = { ...this._value, ...(value ?? {}) };
  }

  public get value() {
    return this._value;
  }

  public get name() {
    return "Донат";
  }

  public get id() {
    return "donation";
  }

  public get markup() {
    return <DonationTriggerComponent trigger={this} />;
  }
}
