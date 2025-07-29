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
import { useContext, useState } from "react";

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

export const IntegrationsPage = observer(({}) => {
  const selection = useContext(IntegrationWizardStoreContext);
  const [tokenStore] = useState(new DefaultTokenStore());
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
            }
          },
        },
        {
          title: "Добавить донатную платформу",
          subtitle: "Введите информацию для подключения",
          content: <AddDonatePayTokenComponent />,
          handler: () => {
            if (selection.system === "donatepay") {
              tokenStore.addToken("DonatePay", selection.accessToken);
            }
          },
        },
      ],
      dynamicStepAmount: true,
    }),
  );

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
              wizardConfiguration.next();
            }}
          />
        </CardList>
      </CardSection>
      <Wizard configurationStore={wizardConfiguration} />
    </>
  );
});
