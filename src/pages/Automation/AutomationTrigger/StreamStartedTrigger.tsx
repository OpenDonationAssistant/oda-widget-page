import { ReactNode } from "react";
import { Renderable } from "../../../utils";
import { AutomationTrigger } from "../AutomationState";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useTokenStore } from "../../../stores/TokenStore";
import { Select } from "antd";
import { log } from "../../../logging";

interface StreamStartedTriggerValue {
  tokenId?: string;
}

const StreamStartedTriggerComponent = observer(
  ({ trigger }: { trigger: StreamStartedTrigger }) => {
    const { store: tokens } = useTokenStore();
    log.debug({ trigger: trigger }, "rendering trigger");

    return (
      <Select
        value={trigger.value?.tokenId ?? null}
        options={tokens.tokens
          .filter(
            (token) =>
              token.system === "Twitch" ||
              token.system === "Youtube" ||
              token.system === "TikTok" ||
              token.system === "Instagram" ||
              token.system === "VKLive" ||
              token.system === "Kick",
          )
          .map((token) => {
            return {
              label: `${token.settings["name"]} (${token.system})`,
              value: token.id,
            };
          })}
        onChange={(value) => {
          trigger.value.tokenId = value;
        }}
      />
    );
  },
);

export class StreamStartedTrigger implements AutomationTrigger, Renderable {
  id = "stream-started";
  name = "Стрим начался";
  value: StreamStartedTriggerValue = { tokenId: undefined };
  markup: ReactNode;

  constructor() {
    makeAutoObservable(this);
    this.markup = <StreamStartedTriggerComponent trigger={this} />;
  }
}
