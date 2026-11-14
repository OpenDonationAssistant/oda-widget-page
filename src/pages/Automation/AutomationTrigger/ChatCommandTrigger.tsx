import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import { Flex, Input, Select } from "antd";
import { AutomationTrigger } from "../AutomationState";
import { ReactNode } from "react";
import { produce } from "immer";
import { Renderable } from "../../../utils";
import { useTranslation } from "react-i18next";

interface ChatCommandTriggerValue {
  system?: string;
  nickname?: string;
  message?: string;
}

const CHAT_SYSTEMS = [
  { label: "Twitch", value: "Twitch" },
  { label: "Kick", value: "Kick" },
  { label: "YouTube", value: "Youtube" },
  { label: "VK Live", value: "VKLive" },
];

const ChatCommandTriggerComponent = observer(
  ({ trigger }: { trigger: ChatCommandTrigger }) => {
    const { t } = useTranslation();
    return (
      <Flex vertical gap={9}>
        <Select
          className="full-width"
          allowClear
          placeholder={t("common-platform")}
          value={trigger.value.system}
          options={CHAT_SYSTEMS}
          onChange={(value) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.system = value;
            });
          }}
        />
        <Input
          value={trigger.value.nickname}
          placeholder={t("common-nickname")}
          onChange={(e) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.nickname = e.target.value;
            });
          }}
        />
        <Input
          value={trigger.value.message}
          placeholder={t("automation-chat-command-placeholder")}
          onChange={(e) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.message = e.target.value;
            });
          }}
        />
      </Flex>
    );
  },
);

export class ChatCommandTrigger implements AutomationTrigger, Renderable {
  private _value: ChatCommandTriggerValue = {
    system: undefined,
    nickname: undefined,
    message: undefined,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public get name() {
    return "automation-trigger-chat-command";
  }

  public get id() {
    return "chat-command";
  }

  public set value(value: ChatCommandTriggerValue) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public get markup(): ReactNode {
    return <ChatCommandTriggerComponent trigger={this} />;
  }
}
