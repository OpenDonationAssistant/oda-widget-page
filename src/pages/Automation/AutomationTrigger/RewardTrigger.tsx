import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import { Flex, Input, Select } from "antd";
import { AutomationTrigger } from "../AutomationState";
import { ReactNode } from "react";
import { produce } from "immer";
import { Renderable } from "../../../utils";
import InputNumber from "../../../components/ConfigurationPage/components/InputNumber";

interface RewardTriggerValue {
  system?: string;
  nickname?: string;
  title?: string;
  cost?: number;
  description?: string;
}

const REWARD_SYSTEMS = [
  { label: "Twitch", value: "Twitch" },
  { label: "Kick", value: "Kick" },
  { label: "VK Live", value: "VKLive" },
  { label: "YouTube", value: "Youtube" },
];

const RewardTriggerComponent = observer(
  ({ trigger }: { trigger: RewardTrigger }) => {
    return (
      <Flex vertical gap={9}>
        <Select
          className="full-width"
          allowClear
          placeholder="Платформа"
          value={trigger.value.system}
          options={REWARD_SYSTEMS}
          onChange={(value) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.system = value;
            });
          }}
        />
        <Input
          value={trigger.value.nickname}
          placeholder="Никнейм"
          onChange={(e) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.nickname = e.target.value;
            });
          }}
        />
        <Input
          value={trigger.value.title}
          placeholder="Название награды"
          onChange={(e) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.title = e.target.value;
            });
          }}
        />
        <InputNumber
          value={trigger.value.cost ?? 0}
          onChange={(value) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.cost = value;
            });
          }}
        />
        <Input
          value={trigger.value.description}
          placeholder="Описание"
          onChange={(e) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.description = e.target.value;
            });
          }}
        />
      </Flex>
    );
  },
);

export class RewardTrigger implements AutomationTrigger, Renderable {
  private _value: RewardTriggerValue = {
    system: undefined,
    nickname: undefined,
    title: undefined,
    cost: undefined,
    description: undefined,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public get name() {
    return "Награда активирована";
  }

  public get id() {
    return "reward-redeemed";
  }

  public set value(value: RewardTriggerValue) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public get markup(): ReactNode {
    return <RewardTriggerComponent trigger={this} />;
  }
}