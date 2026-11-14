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
import { Trans, useTranslation } from "react-i18next";

export class IntegrationWizardStore {
  private _system:
    | "donationalerts"
    | "unofficialdonationalerts"
    | "donatepay.ru"
    | "donatepay.eu"
    | "donate.stream"
    | "donatex"
    | "tribute"
    | "paywall"
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
      | "tribute"
      | "paywall"
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
  const { t } = useTranslation();
  const context = useContext(IntegrationWizardStoreContext);

  return (
    <CardList>
      <Card
        selected={context.system === "donationalerts"}
        onClick={() => (context.system = "donationalerts")}
      >
        <Flex className="full-width" vertical justify="flex-start">
          <CardTitle>DonationAlerts</CardTitle>
          <div className={`${classes.description}`}>
            <Trans
              i18nKey="integration-donationalerts-description"
              components={{ br: <br /> }}
            />
          </div>
        </Flex>
      </Card>
      <Card
        selected={context.system === "unofficialdonationalerts"}
        onClick={() => (context.system = "unofficialdonationalerts")}
      >
        <Flex className="full-width" vertical justify="flex-start">
          <CardTitle>{t("integration-unofficial-title")}</CardTitle>
          <div className={`${classes.description}`}>
            <Trans i18nKey="integration-unofficial-description" />
          </div>
          <div className={`${classes.description}`}>
            <Trans i18nKey="integration-unofficial-memealerts-description" />
          </div>
          <div className={`${classes.description}`}>
            <Trans i18nKey="integration-unofficial-unstable" />
          </div>
        </Flex>
      </Card>
      <Card
        selected={context.system === "donatex"}
        onClick={() => (context.system = "donatex")}
      >
        <Flex className="full-width" vertical justify="flex-start">
          <CardTitle>DonateX</CardTitle>
          <div className={`${classes.description}`}>
            <Trans i18nKey="integration-donatex-description" />
          </div>
        </Flex>
      </Card>
      <Card
        selected={context.system === "donatepay.ru"}
        onClick={() => (context.system = "donatepay.ru")}
      >
        <Flex className="full-width" vertical justify="flex-start">
          <CardTitle>DonatePay.ru</CardTitle>
          <div className={`${classes.description}`}>
            <Trans i18nKey="integration-donatepay-ru-description" />
          </div>
        </Flex>
      </Card>
      <Card
        selected={context.system === "donatepay.eu"}
        onClick={() => (context.system = "donatepay.eu")}
      >
        <Flex className="full-width" vertical justify="flex-start">
          <CardTitle>DonatePay.eu</CardTitle>
          <div className={`${classes.description}`}>
            <Trans i18nKey="integration-donatepay-eu-description" />
          </div>
        </Flex>
      </Card>
      <Card
        selected={context.system === "tribute"}
        onClick={() => (context.system = "tribute")}
      >
        <Flex className="full-width" vertical justify="flex-start">
          <CardTitle>
            <span>Tribute</span>
          </CardTitle>
          <div className={`${classes.description}`}>
            <Trans i18nKey="integration-tribute-description" />
          </div>
        </Flex>
      </Card>
    </CardList>
  );
});

export const AddDonatePayTokenComponent = observer(() => {
  const { t } = useTranslation();
  const context = useContext(IntegrationWizardStoreContext);
  const { recipientId } = useLoaderData() as WidgetData;

  return (
    <Flex vertical className={`${classes.content}`}>
      {context.system === "donatepay.eu" && (
        <Flex className="full-width" gap={12} vertical>
          <div className={`${classes.instruction}`}>
            <Trans
              i18nKey="integration-donatepay-eu-api-instruction"
              components={{ lnk: <a href="https://donatepay.eu/page/api" /> }}
            />
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
            <Trans
              i18nKey="integration-donationalerts-account-settings-instruction"
              components={{
                lnk: (
                  <a href="https://www.donationalerts.com/dashboard/general-settings/account" />
                ),
              }}
            />
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
            <Trans
              i18nKey="integration-donatepay-ru-api-instruction"
              components={{ lnk: <a href="https://donatepay.ru/page/api" /> }}
            />
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
            <Trans
              i18nKey="integration-donatex-settings-instruction"
              components={{
                lnk: <a href="https://donatex.gg/streamer/settings" />,
              }}
            />
          </div>
          <Input
            value={context.accessToken}
            onChange={(value) => {
              context.accessToken = value.target.value;
            }}
          />
        </Flex>
      )}
      {context.system === "tribute" && (
        <Flex className="full-width" gap={12} vertical>
          <div className={`${classes.instruction}`}>
            <Trans i18nKey="integration-tribute-api-key-instruction" />
          </div>
          <Input
            value={context.accessToken}
            onChange={(value) => {
              context.accessToken = value.target.value;
            }}
          />
          <div
            className={`${classes.instruction}`}
            style={{ userSelect: "text" }}
          >
            {t("integration-tribute-webhook-instruction")}{" "}
            https://api.oda.digital/tribute/webhook/{recipientId}
          </div>
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
            title: "integration-wizard-add-donation-platform",
            subtitle: "integration-wizard-choose-donation-platform-subtitle",
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
            title: "integration-wizard-add-donation-platform",
            subtitle: "integration-wizard-enter-connection-info",
            content: <AddDonatePayTokenComponent />,
            condition: () => {
              return Promise.resolve(
                selection.system === "donatepay.ru" ||
                  selection.system === "donatepay.eu" ||
                  selection.system === "donate.stream" ||
                  selection.system === "donatex" ||
                  selection.system === "tribute" ||
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
              if (selection.system === "tribute") {
                tokenStore.addToken("Tribute", selection.accessToken);
                return Promise.resolve(true);
              }
              return Promise.resolve(false);
            },
          },
          {
            title: "integration-wizard-add-donation-platform",
            subtitle: "integration-wizard-enter-connection-info",
            content: <AddDonatePayTokenComponent />,
            condition: () => {
              return Promise.resolve(selection.system === "paywall");
            },
            handler: () => {
              log.debug({ system: selection.system }, "handling adding token");
              if (selection.system === "tribute") {
                tokenStore.addToken("Tribute", selection.accessToken);
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
