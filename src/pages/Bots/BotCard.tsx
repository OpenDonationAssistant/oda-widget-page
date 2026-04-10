import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import {
  Dialog,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../components/Overlay/Overlay";
import { Announcer, Bot, BotStoreContext, Chat } from "../../stores/BotStore";
import { Flex, Input, Switch, Select } from "antd";
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
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { SaveOrCancel } from "../../components/Button/SaveButtons";
import { AnnouncerDataAnnouncerType } from "@opendonationassistant/oda-max-service-client";
import { useModal } from "../../components/Overlay/UseModal";
import UtilityButton from "../../components/Button/UtilityButton";

const AnnouncerComponent = observer(
  ({ announcer }: { announcer: Announcer }) => {
    return (
      <Flex vertical gap={18} className={`${classes.container}`}>
        <LabeledContainer displayName="Текст анонса">
          <TextArea
            value={announcer.text}
            onChange={(e) => {
              announcer.text = e.target.value;
            }}
          />
        </LabeledContainer>
        <LightLabeledSwitchComponent
          label="Удалять анонс по завершению стрима"
          value={announcer.type === AnnouncerDataAnnouncerType.StreamAndDelete}
          onChange={(newValue) => {
            announcer.type = newValue
              ? AnnouncerDataAnnouncerType.StreamAndDelete
              : AnnouncerDataAnnouncerType.Stream;
          }}
        />
        <LabeledContainer displayName="Ссылки">
          <Flex vertical className="full-width" gap={9}>
            {announcer.buttons.map((button, index) => (
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
                    announcer.deleteButton(index);
                  }}
                >
                  <CloseIcon color="#FF8888" />
                </NotBorderedIconButton>
              </Flex>
            ))}
            <AddListItemButton
              label="button-add-link"
              onClick={() => {
                announcer.addButton("", "");
              }}
            />
          </Flex>
        </LabeledContainer>
      </Flex>
    );
  },
);

const AddAnnouncerComponent = ({ bot: bot }: { bot: Bot }) => {
  const { modalState } = useModal();
  const botStore = useContext(BotStoreContext);
  const [selection, setSelection] = useState<Chat | null>(null);

  return (
    <ModalStateContext.Provider value={modalState}>
      <Overlay>
        <Dialog>
          <Title>Выберите чат</Title>
          <Flex
            justify="space-between"
            align="center"
            gap={9}
            className="full-width"
          >
            <Select
              className={`${classes.selectchatbutton}`}
              value={selection?.id}
              options={botStore?.chats.map((chat) => {
                return { label: chat.title, value: chat.id };
              })}
              onChange={(value) => {
                setSelection(
                  botStore?.chats.find((chat) => chat.id === value) ?? null,
                );
              }}
            />
            <UtilityButton
              onClick={() => {
                botStore?.refreshChats();
              }}
            >
              Обновить
            </UtilityButton>
          </Flex>
          <SaveOrCancel
            saveLabel="Выбрать"
            changeable={{
              changed: !!selection,
              save: () => {
                if (selection) {
                  bot.createAnnouncer(selection.id);
                  modalState.show = false;
                }
              },
            }}
          />
        </Dialog>
      </Overlay>
      <AddListItemButton
        label="button-add-announcer"
        onClick={() => {
          modalState.open();
        }}
      />
    </ModalStateContext.Provider>
  );
};

export const BotCard = observer(({ bot }: { bot: Bot }) => {
  const { modalState } = useModal();
  const botStore = useContext(BotStoreContext);

  return (
    <>
      <ModalStateContext.Provider value={modalState}>
        <Overlay>
          <Panel>
            <Title>
              <div>Настройки интеграции MAX</div>
            </Title>
            <List>
              {bot.announcers.map((announcer) => (
                <CollapsibleListItem
                  title={
                    <Flex align="center" gap={6}>
                      <div>Анонс стрима</div>
                      <Switch
                        checked={announcer.enabled}
                        onChange={(e) => (announcer.enabled = e)}
                      />
                    </Flex>
                  }
                  actions={
                    <BorderedIconButton
                      onClick={() => {
                        announcer.delete();
                      }}
                    >
                      <CloseIcon color="#FF8888" />
                    </BorderedIconButton>
                  }
                >
                  <AnnouncerComponent announcer={announcer} />
                </CollapsibleListItem>
              ))}
              <AddAnnouncerComponent bot={bot} />
            </List>
            <SaveOrCancel changeable={bot} />
          </Panel>
        </Overlay>
        <Card
          key={bot.id}
          onClick={() => {
            modalState.show = true;
          }}
        >
          <Flex justify="space-between" className="full-width" align="top">
            <Flex align="center" gap={6}>
              <CardTitle>{bot.name}</CardTitle>
              <Switch checked={bot.enabled} onChange={(e) => bot.toggle()} />
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
