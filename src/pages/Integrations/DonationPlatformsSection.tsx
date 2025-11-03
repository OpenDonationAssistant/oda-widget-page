import { useContext, useState } from "react";
import { DonationPlatformWizard } from "./IntegrationsWizard";
import {
  DefaultTokenStore,
  Token,
  TokenStoreContext,
} from "../../stores/TokenStore";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
  Warning,
} from "../../components/Overlay/Overlay";
import {
  Card,
  CardList,
  CardSectionTitle,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { Flex, Switch } from "antd";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { observer } from "mobx-react-lite";
import { LightLabeledSwitchComponent } from "../../components/LabeledSwitch/LabeledSwitchComponent";
import SecondaryButton from "../../components/Button/SecondaryButton";
import PrimaryButton from "../../components/Button/PrimaryButton";
import classes from "./DonationPlatformsSection.module.css";
import { toJS } from "mobx";
import { deepEqual } from "../../utils";

export const DonationPlatformsSection = observer(({}) => {
  const [selection, setSelection] = useState<string>("");
  const [token, setToken] = useState<Token | null>(null);
  const [originToken, setOriginToken] = useState<Token | null>(null);
  const tokenStore = useContext(TokenStoreContext);
  const parentModalState = useContext(ModalStateContext);
  const [deleteRuleDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [integrationSettingsDialogState, setIntegrationSettingsDialogState] =
    useState<ModalState>(() => new ModalState(parentModalState));

  return (
    <>
      <ModalStateContext.Provider value={deleteRuleDialogState}>
        <Overlay>
          <Warning
            onCancel={() => {
              setSelection("");
            }}
            action={() => {
              deleteRuleDialogState.show = false;
              tokenStore?.deleteToken(selection);
            }}
          >
            Вы точно хотите удалить интеграцию?
          </Warning>
        </Overlay>
      </ModalStateContext.Provider>
      <ModalStateContext.Provider value={integrationSettingsDialogState}>
        <Overlay>
          <Panel>
            <Title>
              <div>Настройки интеграции {token?.system}</div>
            </Title>
            <Flex vertical gap={18} className={`${classes.container}`}>
              <LightLabeledSwitchComponent
                label="Показывать оповещения"
                value={token?.settings["triggerAlerts"]}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["triggerAlerts"] = newValue;
                  }
                }}
              />
              <LightLabeledSwitchComponent
                label="Учитывать в топе"
                value={token?.settings["countInTop"]}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["countInTop"] = newValue;
                  }
                }}
              />
              <LightLabeledSwitchComponent
                label="Учитывать в сборе средств"
                value={token?.settings["addToGoal"]}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["addToGoal"] = newValue;
                  }
                }}
              />
              <LightLabeledSwitchComponent
                label="Запускать рулетку"
                value={token?.settings["triggerReel"]}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["triggerReel"] = newValue;
                  }
                }}
              />
              <LightLabeledSwitchComponent
                label="Учитывать в таймере до конца трансляции"
                value={token?.settings["triggerDonaton"]}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["triggerDonaton"] = newValue;
                  }
                }}
              />
              <Flex
                align="center"
                justify="flex-end"
                gap={12}
                className={`${classes.buttons}`}
              >
                <SecondaryButton
                  onClick={() => (integrationSettingsDialogState.show = false)}
                >
                  Отменить
                </SecondaryButton>
                <PrimaryButton
                  disabled={deepEqual(token, originToken)}
                  onClick={() => {
                    if (token) {
                      tokenStore?.updateToken(token);
                      integrationSettingsDialogState.show = false;
                    }
                  }}
                >
                  Сохранить
                </PrimaryButton>
              </Flex>
            </Flex>
          </Panel>
        </Overlay>
      </ModalStateContext.Provider>
      <CardSectionTitle>Донатные платформы</CardSectionTitle>
      <CardList>
        {tokenStore?.tokens
          .filter(
            (token) =>
              token.system === "DonatePay" ||
              token.system === "DonatePay.eu" ||
              token.system === "DonationAlerts" ||
              token.system === "UnofficialDonationAlerts",
          )
          .map((token) => (
            <Card
              key={token.id}
              onClick={() => {
                setToken(token);
                setOriginToken(structuredClone(toJS(token)));
                integrationSettingsDialogState.show = true;
              }}
            >
              <Flex
                style={{ height: "fit-content" }}
                justify="space-between"
                className="full-width"
                align="center"
              >
                <Flex gap={9} align="center" style={{ height: "fit-content" }}>
                  <CardTitle>{token.system}</CardTitle>
                  <Switch
                    value={token.enabled}
                    onChange={() =>
                      tokenStore.toggleToken(token.id, !token.enabled)
                    }
                  />
                </Flex>
                <BorderedIconButton
                  onClick={() => {
                    setSelection(token.id);
                    deleteRuleDialogState.show = true;
                  }}
                >
                  <CloseIcon color="#FF8888" />
                </BorderedIconButton>
              </Flex>
            </Card>
          ))}
        {tokenStore && <DonationPlatformWizard tokenStore={tokenStore} />}
      </CardList>
    </>
  );
});
