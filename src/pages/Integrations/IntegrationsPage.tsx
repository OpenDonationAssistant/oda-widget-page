import {
  Card,
  CardButton,
  CardList,
  CardSection,
  CardSectionTitle,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import {
  Wizard,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { useContext, useEffect, useState } from "react";

import { Flex, Switch } from "antd";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import classes from "./IntegrationsPage.module.css";
import {
  AddDonatePayTokenComponent,
  ChooseDonationPlatformComponent,
  IntegrationWizardStoreContext,
} from "./IntegrationsWizard";
import { DefaultTokenStore } from "../../stores/TokenStore";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Warning,
} from "../../components/Overlay/Overlay";
import { observer } from "mobx-react-lite";
import { log } from "../../logging";
import { uuidv7 } from "uuidv7";
import { reaction } from "mobx";

export const IntegrationsPage = observer(({}) => {
  const selection = useContext(IntegrationWizardStoreContext);
  const [tokenStore] = useState(() => new DefaultTokenStore());
  const parentModalState = useContext(ModalStateContext);
  const [deleteRuleDialogState] = useState<ModalState>(
    new ModalState(parentModalState),
  );

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
                selection.system === "donate.stream",
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
      <ModalStateContext.Provider value={deleteRuleDialogState}>
        <Overlay>
          <Warning
            action={() => {
              deleteRuleDialogState.show = false;
              tokenStore.deleteToken(selection.accessToken);
            }}
          >
            Вы точно хотите удалить интеграцию?
          </Warning>
        </Overlay>
      </ModalStateContext.Provider>
      <h1>Интеграции</h1>
      <CardSection>
        <CardSectionTitle>Донатные платформы</CardSectionTitle>
        <CardList>
          {tokenStore.tokens.map((token) => (
            <Card key={token.id} onClick={() => {}}>
              <Flex
                style={{ height: "fit-content" }}
                justify="space-between"
                className="full-width"
                align="center"
              >
                <Flex gap={9} align="center" style={{ height: "fit-content" }}>
                  <CardTitle cssClass={`${classes.title}`}>
                    {token.system}
                  </CardTitle>
                  <Switch
                    value={token.enabled}
                    onChange={() =>
                      tokenStore.toggleToken(token.id, !token.enabled)
                    }
                  />
                </Flex>
                <BorderedIconButton
                  onClick={() => {
                    selection.accessToken = token.id;
                    deleteRuleDialogState.show = true;
                  }}
                >
                  <CloseIcon color="#FF8888" />
                </BorderedIconButton>
              </Flex>
            </Card>
          ))}
          <CardButton
            onClick={() => {
              log.debug(
                { conf: wizardConfiguration.index },
                "click on add button",
              );
              wizardConfiguration.next();
            }}
          />
        </CardList>
      </CardSection>
      <Wizard configurationStore={wizardConfiguration} />
    </>
  );
});
