import { observer } from "mobx-react-lite";
import {
  Wizard,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { useContext, useEffect, useState } from "react";
import { log } from "../../logging";
import {
  Card,
  CardButton,
  CardList,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { makeAutoObservable, reaction } from "mobx";
import { Bot, BotStoreContext, Chat } from "../../stores/BotStore";
import { Flex, QRCode, Select } from "antd";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import classes from "./AddBotWizard.module.css";
import UtilityButton from "../../components/Button/UtilityButton";

const ChoosePlatformComponent = observer(
  ({ selection }: { selection: AddBotOperationStore }) => {
    return (
      <CardList>
        <Card
          selected={selection.type === "max"}
          children={<CardTitle>Max</CardTitle>}
          onClick={() => {
            selection.type = "max";
          }}
        />
      </CardList>
    );
  },
);

const AddingBotComponent = observer(
  ({ selection }: { selection: AddBotOperationStore }) => {
    const botStore = useContext(BotStoreContext);
    const [link, setLink] = useState<string | null>(null);

    useEffect(() => {
      if (!selection.type) {
        return;
      }
      botStore?.getLink(selection.type).then((link) => setLink(link));
    }, [selection.type]);

    return (
      <>
        {link && (
          <Flex vertical>
            <div style={{ color: "white" }}>
              Откройте бота с помощью QR кода на телефоне или с помощью ссылки
              на компьютере и нажмите "Начать".
            </div>
            <Flex justify="center" align="center">
              <QRCode value={link} />
            </Flex>
            <Flex justify="space-between" align="center" className="full-width">
              <div style={{ color: "white" }}>{link}</div>
              <BorderedIconButton
                className={`${classes.copybutton}`}
                onClick={() => navigator.clipboard.writeText(link)}
              >
                <span className="material-symbols-sharp">content_copy</span>
              </BorderedIconButton>
            </Flex>
          </Flex>
        )}
        {!link && <div>loading...</div>}
      </>
    );
  },
);

class AddBotOperationStore {
  private _bot: Bot | null = null;
  private _chat: Chat | null = null;
  private _type: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public set bot(bot: Bot | null) {
    this._bot = bot;
  }

  public get bot(): Bot | null {
    return this._bot;
  }

  public set chat(chat: Chat | null) {
    this._chat = chat;
  }

  public get chat(): Chat | null {
    return this._chat;
  }

  public set type(type: string | null) {
    this._type = type;
  }

  public get type(): string | null {
    return this._type;
  }
}

export const AddBotWizard = observer(() => {
  const selection = new AddBotOperationStore();
  const botStore = useContext(BotStoreContext);

  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    new WizardConfigurationStore({
      steps: [
        {
          title: "Добавить бота",
          subtitle: "Выберите платформу, на которой хотите добавить бота",
          content: <ChoosePlatformComponent selection={selection} />,
          handler: () => {
            return Promise.resolve(true);
          },
        },
        {
          title: "Добавить бота",
          subtitle: "Подключите бота к вашему аккаунту",
          content: <AddingBotComponent selection={selection} />,
          handler: () => {
            return (
              botStore?.refresh().then(() => true) ?? Promise.resolve(true)
            );
          },
          isInformation: true,
        },
      ],
      dynamicStepAmount: false,
      reset: () => {
        log.debug("resetting integration page wizard");
        selection.type = null;
      },
    }),
  );

  useEffect(() => {
    reaction(
      () => selection.type,
      () => {
        wizardConfiguration.canContinue = !!selection.type;
      },
    );
  }, [wizardConfiguration]);

  useEffect(() => {
    reaction(
      () => selection.chat,
      () => {
        wizardConfiguration.canContinue = !!selection.chat;
      },
    );
  }, [wizardConfiguration]);

  return (
    <>
      <Wizard configurationStore={wizardConfiguration} />
      <CardButton onClick={() => wizardConfiguration.next()} />
    </>
  );
});
