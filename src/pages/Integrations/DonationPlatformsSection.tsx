import { useContext, useState } from "react";
import { DonationPlatformWizard } from "./IntegrationsWizard";
import { Token, useTokenStore } from "../../stores/TokenStore";
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
import DonationAlertsIcon from "../../icons/DonationAlertsIcon";
import DonateXIcon from "../../icons/DonateXIcon";
import DonatePayIcon from "../../icons/DonatePayIcon";
import { NewFeature } from "../../components/Experimental/Experimental";
import { useTranslation } from "react-i18next";

const icons = new Map<string, JSX.Element>();
icons.set(
  "DonationAlerts",
  <DonationAlertsIcon color="var(--oda-primary-color)" />,
);
icons.set(
  "UnofficialDonationAlerts",
  <DonationAlertsIcon color="var(--oda-primary-color)" />,
);
icons.set("DonateX", <DonateXIcon color="var(--oda-primary-color)" />);
icons.set("DonatePay", <DonatePayIcon color="var(--oda-primary-color)" />);
icons.set("DonatePay.eu", <DonatePayIcon color="var(--oda-primary-color)" />);

export const DonationPlatformsSection = observer(({}) => {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<string>("");
  const [token, setToken] = useState<Token | null>(null);
  const [originToken, setOriginToken] = useState<Token | null>(null);
  const { store: tokenStore } = useTokenStore();
  const parentModalState = useContext(ModalStateContext);
  const [deleteRuleDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [integrationSettingsDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );

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
              tokenStore.deleteToken(selection);
            }}
          >
            {t("integration-delete-confirm")}
          </Warning>
        </Overlay>
      </ModalStateContext.Provider>
      <ModalStateContext.Provider value={integrationSettingsDialogState}>
        <Overlay>
          <Panel>
            <Title>
              <div>
                {t("integration-settings-title", { system: token?.system })}
              </div>
            </Title>
            <Flex vertical gap={18} className={`${classes.container}`}>
              <LightLabeledSwitchComponent
                label="dialog-add-donation-show-alert"
                value={token?.settings["triggerAlerts"] ?? false}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["triggerAlerts"] = newValue;
                  }
                }}
              />
              <LightLabeledSwitchComponent
                label="dialog-add-donation-count-in-top"
                value={token?.settings["countInTop"] ?? true}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["countInTop"] = newValue;
                  }
                }}
              />
              <LightLabeledSwitchComponent
                label="dialog-add-donation-count-in-goal"
                value={token?.settings["addToGoal"] ?? true}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["addToGoal"] = newValue;
                  }
                }}
              />
              <LightLabeledSwitchComponent
                label="dialog-add-donation-trigger-reel"
                value={token?.settings["triggerReel"] ?? true}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["triggerReel"] = newValue;
                  }
                }}
              />
              <LightLabeledSwitchComponent
                label="integration-count-in-timer"
                value={token?.settings["triggerDonaton"] ?? true}
                onChange={(newValue) => {
                  if (token) {
                    token.settings["triggerDonaton"] = newValue;
                  }
                }}
              />
              {token?.system === "Tribute" && (
                <>
                  <LightLabeledSwitchComponent
                    label="integration-subscriptions-show-alerts"
                    value={
                      token?.settings["subscriptionsTriggerAlerts"] ?? true
                    }
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["subscriptionsTriggerAlerts"] = newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-subscriptions-count-in-goal"
                    value={token?.settings["subscriptionsAddToGoal"] ?? true}
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["subscriptionsAddToGoal"] = newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-subscriptions-count-in-timer"
                    value={
                      token?.settings["subscriptionsTriggerDonaton"] ?? true
                    }
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["subscriptionsTriggerDonaton"] =
                          newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-subscriptions-trigger-reel"
                    value={token?.settings["subscriptionsTriggerReel"] ?? true}
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["subscriptionsTriggerReel"] = newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-subscriptions-count-in-top"
                    value={token?.settings["subscriptionsCountInTop"] ?? true}
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["subscriptionsCountInTop"] = newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-purchases-show-alerts"
                    value={token?.settings["purchasesTriggerAlerts"] ?? true}
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["purchasesTriggerAlerts"] = newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-purchases-count-in-goal"
                    value={token?.settings["purchasesAddToGoal"] ?? true}
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["purchasesAddToGoal"] = newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-purchases-count-in-timer"
                    value={token?.settings["purchasesTriggerDonaton"] ?? true}
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["purchasesTriggerDonaton"] = newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-purchases-trigger-reel"
                    value={token?.settings["purchasesTriggerReel"] ?? true}
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["purchasesTriggerReel"] = newValue;
                      }
                    }}
                  />
                  <LightLabeledSwitchComponent
                    label="integration-purchases-count-in-top"
                    value={token?.settings["purchasesCountInTop"] ?? true}
                    onChange={(newValue) => {
                      if (token) {
                        token.settings["purchasesCountInTop"] = newValue;
                      }
                    }}
                  />
                </>
              )}

              <Flex
                align="center"
                justify="flex-end"
                gap={12}
                className={`${classes.buttons}`}
              >
                <SecondaryButton
                  onClick={() => (integrationSettingsDialogState.show = false)}
                >
                  {t("button-cancel")}
                </SecondaryButton>
                <PrimaryButton
                  disabled={deepEqual(token, originToken)}
                  onClick={() => {
                    if (token) {
                      tokenStore.updateToken(token);
                      integrationSettingsDialogState.show = false;
                    }
                  }}
                >
                  {t("button-save")}
                </PrimaryButton>
              </Flex>
            </Flex>
          </Panel>
        </Overlay>
      </ModalStateContext.Provider>
      <CardSectionTitle>
        <div>{t("integration-donation-platforms")}</div>
        <span className={`${classes.comment}`}>
          {t("integration-alerts-widget-note")}
        </span>
      </CardSectionTitle>
      <CardList>
        {tokenStore.tokens
          .filter(
            (token) =>
              token.system === "DonatePay" ||
              token.system === "DonatePay.eu" ||
              token.system === "DonationAlerts" ||
              token.system === "UnofficialDonationAlerts" ||
              token.system === "DonateX" ||
              token.system === "Tribute" ||
              token.system === "Paywall",
          )
          .map((token) => (
            <Card
              key={token.id}
              onClick={() => {
                if (token.settings === undefined) {
                  token.settings = {};
                }
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
                  {icons.get(token.system)}
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
        <DonationPlatformWizard tokenStore={tokenStore} />
      </CardList>
    </>
  );
});
