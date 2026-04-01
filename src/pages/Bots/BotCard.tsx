import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../components/Overlay/Overlay";
import { Bot, BotStoreContext, MaxButton } from "../../stores/BotStore";
import { Flex } from "antd";
import { LightLabeledSwitchComponent } from "../../components/LabeledSwitch/LabeledSwitchComponent";
import classes from "./BotCard.module.css";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import { AddListItemButton } from "../../components/List/List";
import TextArea from "antd/es/input/TextArea";
import { Card, CardTitle } from "../../components/Cards/CardsComponent";
import PrimaryButton from "../../components/Button/PrimaryButton";
import SecondaryButton from "../../components/Button/SecondaryButton";

export const BotCard = observer(({ bot }: { bot: Bot }) => {
  const parentModalState = useContext(ModalStateContext);
  const [botSettingsDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const botStore = useContext(BotStoreContext);

  const [text, setText] = useState<string>("");
  const [buttons, setButtons] = useState<MaxButton[]>([]);

  useEffect(() => {
    botStore?.announcers(bot).then((data) => {
      if (data) {
        setText(data.text);
        setButtons(data.buttons ?? []);
      }
    });
  }, [bot]);

  return (
    <>
      <ModalStateContext.Provider value={botSettingsDialogState}>
        <Overlay>
          <Panel>
            <Title>
              <div>Настройки интеграции MAX</div>
            </Title>
            <Flex vertical gap={18} className={`${classes.container}`}>
              <LightLabeledSwitchComponent
                label="Делать анонс стрима"
                value={bot.enabled}
                onChange={(newValue) => {}}
              />
              <LabeledContainer displayName="Текст анонса">
                <TextArea value={text} onChange={(e) => {}} />
              </LabeledContainer>
              <LabeledContainer displayName="Ссылки">
                {buttons.map((button, number) => (
                  <Flex key={number}>
                    <div>{button.text}</div>
                    <div>{button.url}</div>
                  </Flex>
                ))}
                <AddListItemButton
                  label="button-add-link"
                  onClick={() => {
                    setButtons([...buttons, ...[{ text: "", url: "" }]]);
                  }}
                />
              </LabeledContainer>
              <Flex
                align="center"
                justify="flex-end"
                gap={12}
                className={`${classes.buttons}`}
              >
                <SecondaryButton
                  onClick={() => (botSettingsDialogState.show = false)}
                >
                  Отменить
                </SecondaryButton>
                <PrimaryButton onClick={() => {}}>Сохранить</PrimaryButton>
              </Flex>
            </Flex>
          </Panel>
        </Overlay>
        <Card
          key={bot.id}
          children={<CardTitle>{bot.type}</CardTitle>}
          onClick={() => {
            botSettingsDialogState.show = true;
          }}
        />
      </ModalStateContext.Provider>
    </>
  );
});
