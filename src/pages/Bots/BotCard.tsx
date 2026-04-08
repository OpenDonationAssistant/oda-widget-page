import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../components/Overlay/Overlay";
import { Announcer, Bot, BotStoreContext } from "../../stores/BotStore";
import { Flex, Input, Switch } from "antd";
import { LightLabeledSwitchComponent } from "../../components/LabeledSwitch/LabeledSwitchComponent";
import classes from "./BotCard.module.css";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import {
  AddListItemButton,
  CollapsibleListItem,
  List,
} from "../../components/List/List";
import TextArea from "antd/es/input/TextArea";
import { Card, CardTitle } from "../../components/Cards/CardsComponent";
import PrimaryButton from "../../components/Button/PrimaryButton";
import SecondaryButton from "../../components/Button/SecondaryButton";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";

const AnnouncerComponent = observer(
  ({ announcer }: { announcer: Announcer }) => {
    const modalState = useContext(ModalStateContext);

    return (
      <Flex vertical gap={18} className={`${classes.container}`}>
        <LightLabeledSwitchComponent
          label="Делать анонс стрима"
          value={announcer?.enabled || false}
          onChange={(newValue) => {
            if (announcer) {
              announcer.enabled = newValue;
            }
          }}
        />
        {announcer?.enabled && (
          <LightLabeledSwitchComponent
            label="Удалять анонс по завершению стрима"
            value={announcer?.enabled || false}
            onChange={(newValue) => {
              if (announcer) {
                announcer.enabled = newValue;
              }
            }}
          />
        )}
        {announcer?.enabled && (
          <LabeledContainer displayName="Текст анонса">
            <TextArea
              value={announcer?.text}
              onChange={(e) => {
                if (announcer) {
                  announcer.text = e.target.value;
                }
              }}
            />
          </LabeledContainer>
        )}
        {announcer?.enabled && (
          <LabeledContainer displayName="Ссылки">
            <Flex vertical className="full-width" gap={9}>
              {announcer?.buttons.map((button, index) => (
                <Flex key={index} gap={6} align="center">
                  <Input
                    value={button.text}
                    placeholder="Текст"
                    onChange={(e) => {
                      button.text = e.target.value;
                    }}
                  />
                  <Input
                    value={button.url}
                    placeholder="Ссылка"
                    onChange={(e) => {
                      button.url = e.target.value;
                    }}
                  />
                  <NotBorderedIconButton
                    onClick={() => {
                      announcer?.deleteButton(index);
                    }}
                  >
                    <CloseIcon color="#FF8888" />
                  </NotBorderedIconButton>
                </Flex>
              ))}
              <AddListItemButton
                label="button-add-link"
                onClick={() => {
                  announcer?.addButton("", "");
                }}
              />
            </Flex>
          </LabeledContainer>
        )}
        <Flex
          align="center"
          justify="flex-end"
          gap={12}
          className={`${classes.buttons}`}
        >
          <SecondaryButton onClick={() => (modalState.show = false)}>
            Отменить
          </SecondaryButton>
          <PrimaryButton onClick={() => {}}>Сохранить</PrimaryButton>
        </Flex>
      </Flex>
    );
  },
);

export const BotCard = observer(({ bot }: { bot: Bot }) => {
  const parentModalState = useContext(ModalStateContext);
  const [botSettingsDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const botStore = useContext(BotStoreContext);

  return (
    <>
      <ModalStateContext.Provider value={botSettingsDialogState}>
        <Overlay>
          <Panel>
            <Title>
              <div>Настройки интеграции MAX</div>
            </Title>
            <List>
              {bot.announcers.map((announcer) => (
                <CollapsibleListItem title={"Делать анонс"} actions={<></>}>
                  <AnnouncerComponent announcer={announcer} />
                </CollapsibleListItem>
              ))}
            </List>
          </Panel>
        </Overlay>
        <Card
          key={bot.id}
          onClick={() => {
            botSettingsDialogState.show = true;
          }}
        >
          <Flex justify="space-between" className="full-width" align="top">
            <Flex align="center" gap={6}>
              <CardTitle>{bot.name}</CardTitle>
              <Switch checked={bot.enabled} />
            </Flex>
            <BorderedIconButton onClick={() => botStore?.removeBot(bot)}>
              <CloseIcon color="#FF8888" />
            </BorderedIconButton>
          </Flex>
        </Card>
      </ModalStateContext.Provider>
    </>
  );
});
