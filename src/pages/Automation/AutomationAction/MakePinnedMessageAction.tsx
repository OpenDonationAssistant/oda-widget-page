import { ReactNode, useContext, useState } from "react";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Textarea from "../../../components/Textarea/Textarea";
import { TokenStoreContext } from "../../../stores/TokenStore";
import { Select } from "antd";

interface MakePinnedMessageActionValue {
  text: string;
}

const MakePinnedMessageActionComponent = observer(
  ({ action }: { action: MakePinnedMessageAction }) => {
    const [sender, setSender] = useState<string | null>(null);
    const [receiver, setReceiver] = useState<string | null>(null);
    const tokenStore = useContext(TokenStoreContext);
    if (!tokenStore) {
      return null;
    }
    const tokens = tokenStore.tokens
      .filter((token) => token.enabled)
      .filter((token) => token.system === "Twitch");

    return (
      <LabeledContainer displayName="Текст сообщения">
        <Textarea
          value={action.value.text}
          onChange={(value) => (action.value.text = value)}
        />
        <LabeledContainer displayName="Аккаунт, кто пишет">
          <Select
            options={tokens.map((token) => {
              return {
                label: token.settings["name"],
                value: token.id,
              };
            })}
            onChange={(value) => {
              setSender(value);
            }}
          />
        </LabeledContainer>
        <LabeledContainer displayName="В каком чате">
          <Select
            options={tokens.map((token) => {
              return {
                label: token.settings["name"],
                value: token.id,
              };
            })}
            onChange={(value) => {
              setReceiver(value);
            }}
          />
        </LabeledContainer>
      </LabeledContainer>
    );
  },
);

export class MakePinnedMessageAction implements AutomationAction, Renderable {
  id = "make-pinned-message";
  name = "Отправить и закрепить сообщение в Twitch чате";
  markup: ReactNode = (<MakePinnedMessageActionComponent action={this} />);
  value: MakePinnedMessageActionValue = { text: "" };

  constructor() {
    makeAutoObservable(this);
  }
}
