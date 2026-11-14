import { ReactNode } from "react";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Textarea from "../../../components/Textarea/Textarea";
import { useTokenStore } from "../../../stores/TokenStore";
import { Select } from "antd";

interface MakePinnedMessageActionValue {
  senderRefreshTokenId: string;
  recipientTwitchId: string;
  message: string;
}

const MakePinnedMessageActionComponent = observer(
  ({ action }: { action: MakePinnedMessageAction }) => {
    const { store: tokenStore } = useTokenStore();
    const tokens = tokenStore.tokens
      .filter((token) => token.enabled)
      .filter((token) => token.system === "Twitch");

    return (
      <>
        <LabeledContainer displayName="automation-pin-message-text">
          <Textarea
            value={action.value.message}
            onChange={(value) => (action.value.message = value)}
          />
        </LabeledContainer>
        <LabeledContainer displayName="automation-pin-message-sender">
          <Select
            className="full-width"
            value={action.value.senderRefreshTokenId}
            options={tokens.map((token) => {
              return {
                label: token.settings["name"],
                value: token.id,
              };
            })}
            onChange={(value) => {
              action.value.senderRefreshTokenId = value;
            }}
          />
        </LabeledContainer>
        <LabeledContainer displayName="automation-pin-message-channel">
          <Select
            className="full-width"
            value={action.value.recipientTwitchId}
            options={tokens.map((token) => {
              return {
                label: token.settings["name"],
                value: token.settings["id"],
              };
            })}
            onChange={(value) => {
              action.value.recipientTwitchId = value;
            }}
          />
        </LabeledContainer>
      </>
    );
  },
);

export class MakePinnedMessageAction implements AutomationAction, Renderable {
  id = "pin-twitch-message";
  name = "automation-action-pin-message";
  markup: ReactNode = (<MakePinnedMessageActionComponent action={this} />);
  value: MakePinnedMessageActionValue = {
    message: "",
    senderRefreshTokenId: "",
    recipientTwitchId: "",
  };

  constructor() {
    makeAutoObservable(this);
  }
}
