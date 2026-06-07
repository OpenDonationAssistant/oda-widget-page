import { ReactNode } from "react";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Textarea from "../../../components/Textarea/Textarea";

interface MakePinnedMessageActionValue {
  text: string;
}

const MakePinnedMessageActionComponent = observer(
  ({ action }: { action: MakePinnedMessageAction }) => {
    return (
      <LabeledContainer displayName="Текст сообщения">
        <Textarea
          value={action.value.text}
          onChange={(value) => (action.value.text = value)}
        />
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
