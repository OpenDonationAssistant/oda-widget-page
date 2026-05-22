import { makeAutoObservable, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { createContext, useContext, useEffect, useState } from "react";
import {
  Card,
  CardButton,
  CardList,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { Flex, Input } from "antd";
import classes from "./IntegrationsWizard.module.css";
import {
  Wizard,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { log } from "../../logging";
import { TokenStore } from "../../stores/TokenStore";
import { uuidv7 } from "uuidv7";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";

export class IntegrationWizardStore {
  private _system:
    | "donationalerts"
    | "unofficialdonationalerts"
    | "donatepay.ru"
    | "donatepay.eu"
    | "donate.stream"
    | "donatex"
    | null = null;
  private _accessToken: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  public set system(
    system:
      | "donationalerts"
      | "unofficialdonationalerts"
      | "donatepay.ru"
      | "donatepay.eu"
      | "donate.stream"
      | "donatex"
      | null,
  ) {
    this._system = system;
  }

  public get system() {
    return this._system;
  }

  public set accessToken(token: string) {
    this._accessToken = token;
  }

  public get accessToken(): string {
    return this._accessToken;
  }
}

export const IntegrationWizardStoreContext = createContext(
  new IntegrationWizardStore(),
);

export const ChooseDonationPlatformComponent = observer(() => {
  const context = useContext(IntegrationWizardStoreContext);
  const { features } = useLoaderData() as WidgetData;

  const hasUnofficialDA =
    features.find((f) => f.name === "UnofficialDonationAlerts")?.state ===
    "ENABLED";

  return (
    <CardList>
      <Card
        selected={context.system === "donationalerts"}
        onClick={() => (context.system = "donationalerts")}
      >
        <CardTitle>DonationAlerts</CardTitle>
        <div className={`${classes.description}`}>
          Позволяет учитывать донаты с сайта DonationAlerts в таких виджетах как
          "Топ донатеры", "Таймер до конца трансляции", "Цель сбора".
        </div>
        <div className={`${classes.description}`}>
          Если включить оповещения для DA, то озвучка будет от ODA. Заказы
          музыки не переносятся.
        </div>
      </Card>
      {hasUnofficialDA && (
        <Card
          selected={context.system === "unofficialdonationalerts"}
          onClick={() => (context.system = "unofficialdonationalerts")}
        >
          <CardTitle>Unofficial DonationAlerts</CardTitle>
          <div className={`${classes.description}`}>
            Делает полноценную интеграцию - учитывает донаты с сайта
            DonationAlerts в таких виджетах как "Топ донатеры", "Таймер до конца
            трансляции", "Цель сбора" И подхватывает озвучку с DA, как и заказы
            музыки.
          </div>
          <div className={`${classes.description}`}>
            Может работать нестабильно.
          </div>
        </Card>
      )}
      <Card
        selected={context.system === "donatex"}
        onClick={() => (context.system = "donatex")}
      >
        <CardTitle>DonateX</CardTitle>
        <div className={`${classes.description}`}>
          Делает полноценную интеграцию - учитывает донаты с DonateX в таких
          виджетах как "Топ донатеры", "Таймер до конца трансляции", "Цель
          сбора" И подхватывает озвучку, как и заказы музыки.
        </div>
      </Card>
      <Card
        selected={context.system === "donatepay.ru"}
        onClick={() => (context.system = "donatepay.ru")}
      >
        <CardTitle>DonatePay.ru</CardTitle>
        <div className={`${classes.description}`}>
          Позволяет учитывать донаты с DonatePay в таких виджетах как "Топ
          донатеры", "Таймер до конца трансляции", "Цель сбора". Также позволяет
          отображать оповещения, но с озвучкой ODA.
        </div>
      </Card>
      <Card
        selected={context.system === "donatepay.eu"}
        onClick={() => (context.system = "donatepay.eu")}
      >
        <CardTitle>DonatePay.eu</CardTitle>
        <div className={`${classes.description}`}>
          Позволяет учитывать донаты с DonatePay.EU в таких виджетах как "Топ
          донатеры", "Таймер до конца трансляции", "Цель сбора". Также позволяет
          отображать оповещения, но с озвучкой ODA.
        </div>
      </Card>
    </CardList>
  );
});

export const AddDonatePayTokenComponent = observer(() => {
  const context = useContext(IntegrationWizardStoreContext);

  return (
    <Flex vertical className={`${classes.content}`}>
      {context.system === "donatepay.eu" && (
        <Flex className="full-width" gap={12} vertical>
          <div className={`${classes.instruction}`}>
            1. Укажите API ключ. Скопировать API ключ можно на странице{" "}
            <a href="https://donatepay.eu/page/api">API DonatePay.eu</a>
          </div>
          <Input
            value={context.accessToken}
            onChange={(value) => {
              context.accessToken = value.target.value;
            }}
          />
        </Flex>
      )}
      {context.system === "unofficialdonationalerts" && (
        <Flex className="full-width" gap={12} vertical>
          <div className={`${classes.instruction}`}>
            1. Укажите Секретный токен. Скопировать его можно на странице{" "}
            <a href="https://www.donationalerts.com/dashboard/general-settings/account">
              Настройки аккаунта
            </a>
          </div>
          <Input
            value={context.accessToken}
            onChange={(value) => {
              context.accessToken = value.target.value;
            }}
          />
        </Flex>
      )}
      {context.system === "donatepay.ru" && (
        <Flex className="full-width" gap={12} vertical>
          <div className={`${classes.instruction}`}>
            1. Укажите API ключ. Скопировать API ключ можно на странице{" "}
            <a href="https://donatepay.ru/page/api">API DonatePay.ru</a>
          </div>
          <Input
            value={context.accessToken}
            onChange={(value) => {
              context.accessToken = value.target.value;
            }}
          />
        </Flex>
      )}
      {context.system === "donatex" && (
        <Flex className="full-width" gap={12} vertical>
          <div className={`${classes.instruction}`}>
            1. Укажите API ключ. Скопировать API ключ можно на странице{" "}
            <a href="https://donatex.gg/streamer/settings">Настройки</a>
          </div>
          <Input
            value={context.accessToken}
            onChange={(value) => {
              context.accessToken = value.target.value;
            }}
          />
        </Flex>
      )}
    </Flex>
  );
});

export const DonationPlatformWizard = observer(
  ({ tokenStore }: { tokenStore: TokenStore }) => {
    const selection = useContext(IntegrationWizardStoreContext);

    const [wizardConfiguration] = useState<WizardConfigurationStore>(
      new WizardConfigurationStore({
        steps: [
          {
            title: "Добавить донатную платформу",
            subtitle: "Выберите донатную платформу, которую хотите добавить",
            content: <ChooseDonationPlatformComponent />,
            handler: () => {
              if (selection.system === "donationalerts") {
                window.open(
                  "https://www.donationalerts.com/oauth/authorize?client_id=13593&redirect_uri=https%3A%2F%2Fwidgets.oda.digital&response_type=code&scope=oauth-donation-subscribe oauth-user-show",
                );
                log.debug("opening donationalerts");
                return Promise.resolve(true);
              }
              if (selection.system === "donate.stream") {
                selection.accessToken = uuidv7();
                return Promise.resolve(true);
              }
              return Promise.resolve(selection.system !== null);
            },
          },
          {
            title: "Добавить донатную платформу",
            subtitle: "Введите информацию для подключения",
            content: <AddDonatePayTokenComponent />,
            condition: () => {
              return Promise.resolve(
                selection.system === "donatepay.ru" ||
                  selection.system === "donatepay.eu" ||
                  selection.system === "donate.stream" ||
                  selection.system === "donatex" ||
                  selection.system === "unofficialdonationalerts",
              );
            },
            handler: () => {
              log.debug({ system: selection.system }, "handling adding token");
              if (selection.system === "donatepay.ru") {
                tokenStore.addToken("DonatePay", selection.accessToken);
                return Promise.resolve(true);
              }
              if (selection.system === "donatepay.eu") {
                tokenStore.addToken("DonatePay.eu", selection.accessToken);
                return Promise.resolve(true);
              }
              if (selection.system === "donate.stream") {
                tokenStore.addToken("Donate.Stream", selection.accessToken);
                return Promise.resolve(true);
              }
              if (selection.system === "donatex") {
                tokenStore.addToken("DonateX", selection.accessToken);
                return Promise.resolve(true);
              }
              if (selection.system === "unofficialdonationalerts") {
                tokenStore.addToken(
                  "UnofficialDonationAlerts",
                  selection.accessToken,
                );
                return Promise.resolve(true);
              }
              if (selection.system === "donationalerts") {
                return Promise.resolve(true);
              }
              return Promise.resolve(false);
            },
          },
        ],
        dynamicStepAmount: true,
        reset: () => {
          log.debug("resetting integration page wizard");
          selection.system = null;
          selection.accessToken = "";
        },
      }),
    );

    useEffect(() => {
      reaction(
        () => selection.system,
        () => {
          log.debug({ system: selection.system }, "checking selection system");
          wizardConfiguration.canContinue = !!selection.system;
        },
      );
    }, [selection.system, wizardConfiguration]);

    useEffect(() => {
      reaction(
        () => selection.accessToken,
        () => {
          log.debug(
            { accessToken: selection.accessToken },
            "checking access token",
          );
          wizardConfiguration.canContinue = !!selection.accessToken;
        },
      );
    }, [selection.accessToken, wizardConfiguration]);

    return (
      <>
        <Wizard configurationStore={wizardConfiguration} />
        <CardButton onClick={() => wizardConfiguration.next()} />
      </>
    );
  },
);
