import { observer } from "mobx-react-lite";
import {
  GatewayInfo,
  Instruction,
  PaymentGatewayConfigurationStore,
} from "./PaymentGatewayConfigurationStore";
import {
  Card,
  CardButton,
  CardList,
} from "../../components/Cards/CardsComponent";
import { Flex, Input, Switch } from "antd";
import classes from "./PaymentGatewaysConfiguration.module.css";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { useContext, useState } from "react";
import {
  Continuation,
  ContinuationContext,
  Wizard,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { useTranslation } from "react-i18next";

export const GatewayCard = observer(
  ({
    info,
    selected,
    onClick,
    onDelete,
  }: {
    info: GatewayInfo;
    selected: boolean;
    onClick: () => void;
    onDelete?: () => void;
  }) => {
    const { t } = useTranslation();
    return (
      <Card
        selected={!onDelete && selected}
        onClick={onDelete ? undefined : onClick}
      >
        <Flex vertical gap={36}>
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={12} justify="flex-start">
              <div className={`${classes.gatewayname}`}>{t(info.name)}</div>
              {onDelete && <Switch value={selected} onClick={onClick} />}
            </Flex>
            {onDelete && (
              <BorderedIconButton onClick={onDelete}>
                <CloseIcon color="#FF8888" />
              </BorderedIconButton>
            )}
          </Flex>
          <Flex vertical gap={3}>
            {info.goodpoints.map((it, index) => (
              <div key={index} className={`${classes.goodpoint}`}>
                {t(it)}
              </div>
            ))}
            {info.badpoints.map((it, index) => (
              <div key={index} className={`${classes.badpoint}`}>
                {t(it)}
              </div>
            ))}
          </Flex>
        </Flex>
      </Card>
    );
  },
);

const SettingsModal = observer(
  ({ configuration }: { configuration: PaymentGatewayConfigurationStore }) => {
    const continuation = useContext(ContinuationContext);
    const { t } = useTranslation();

    const checkFields = () => {
      continuation.canContinue = true;
      configuration.gateway?.fields.forEach((field) => {
        if (!field.value) {
          continuation.canContinue = false;
        }
      });
    };

    checkFields();

    return (
      <Flex gap={36} vertical className="full-width">
        {configuration.gateway && (
          <FullGatewayInfoCard info={configuration.gateway} />
        )}
        {configuration.gateway &&
          configuration.gateway.fields.map((field) => (
            <Flex key={field.id} vertical className="full-width">
              <div className={`${classes.fieldname}`}>{t(field.name)}</div>
              <div className={`${classes.fieldcomment}`}>
                {field.comment ? t(field.comment) : null}
              </div>
              <Input
                value={field.value}
                className={`${classes.fieldvalue}`}
                onChange={(e) => {
                  field.value = e.target.value;
                  checkFields();
                }}
              />
            </Flex>
          ))}
      </Flex>
    );
  },
);

const InstructionLine = observer(
  ({ instructions }: { instructions: Instruction[] }) => {
    const { t } = useTranslation();
    return (
      <Flex gap={36} vertical>
        {instructions.map((line, index) => (
          <Flex key={index} vertical gap={6}>
            <div className={`${classes.instructionstatement}`}>
              {t(line.statement)}
            </div>
            <div className={`${classes.instructioncomment}`}>
              {typeof line.comment === "string"
                ? line.comment
                  ? t(line.comment)
                  : null
                : line.comment}
            </div>
            {line.screen && (
              <img src={line.screen} className={`${classes.screen}`} />
            )}
          </Flex>
        ))}
      </Flex>
    );
  },
);

const InstructionModal = observer(
  ({
    configuration,
    step,
  }: {
    configuration: PaymentGatewayConfigurationStore;
    step: number;
  }) => {
    return (
      <Flex vertical className="full-width" gap={42}>
        {configuration.gateway && (
          <FullGatewayInfoCard info={configuration.gateway} />
        )}
        {configuration.gateway && (
          <InstructionLine
            instructions={configuration.gateway.instructions.get(step) ?? []}
          />
        )}
      </Flex>
    );
  },
);

const FullGatewayInfoCard = observer(({ info }: { info: GatewayInfo }) => {
  const { t } = useTranslation();
  return (
    <div className={`${classes.card}`}>
      <div className={`${classes.choosenmethod}`}>
        {t("gateway-selected-payment-method")}
      </div>
      <Flex vertical justify="flex-end">
        <Flex align="center" justify="space-between">
          <div className={`${classes.gatewayname}`}>{t(info.name)}</div>
        </Flex>
        <Flex vertical gap={3}>
          {info.goodpoints.map((it, index) => (
            <div key={index} className={`${classes.selectedgoodpoint}`}>
              {t(it)}
            </div>
          ))}
          {info.badpoints.map((it, index) => (
            <div key={index} className={`${classes.badpoint}`}>
              {t(it)}
            </div>
          ))}
        </Flex>
      </Flex>
    </div>
  );
});

const ChooseGatewayModal = observer(
  ({
    type,
    configuration,
  }: {
    type: string;
    configuration: PaymentGatewayConfigurationStore;
  }) => {
    const continuation = useContext(ContinuationContext);
    continuation.canContinue = configuration.gateway !== null;

    return (
      <>
        <CardList>
          {configuration.gateways
            .filter((it) => it.type === type)
            .map((it) => (
              <GatewayCard
                key={it.id}
                info={it}
                selected={configuration.gateway?.id === it.id}
                onClick={() => {
                  configuration.gateway =
                    configuration.gateway?.id === it.id ? null : it;
                  continuation.canContinue = configuration.gateway !== null;
                }}
              />
            ))}
        </CardList>
      </>
    );
  },
);

export const ExisingGateways = observer(
  ({
    configuration,
    type,
  }: {
    configuration: PaymentGatewayConfigurationStore;
    type: string;
  }) => {
    return (
      <>
        {configuration.configurations.flatMap((conf) => {
          const gateways = configuration.gateways
            .filter((gateway) => gateway.type === type)
            .filter((gateway) => gateway.id === conf.gateway);

          return gateways.map((gateway) => (
            <GatewayCard
              key={conf.id}
              info={gateway}
              selected={conf.enabled}
              onClick={() => {
                configuration.toggle(conf.id);
              }}
              onDelete={() => {
                configuration.delete(conf.id);
              }}
            />
          ));
        })}
      </>
    );
  },
);

export function FiatGatewaysSection({
  configuration,
}: {
  configuration: PaymentGatewayConfigurationStore;
}) {
  const { t } = useTranslation();
  const [continuation] = useState<Continuation>(new Continuation());
  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    () =>
      new WizardConfigurationStore({
        steps: [
          {
            title: "gateway-wizard-add-donation-method",
            subtitle: "gateway-wizard-choose-partner-subtitle",
            content: (
              <ChooseGatewayModal type="fiat" configuration={configuration} />
            ),
            handler: () => {
              return Promise.resolve(true);
            },
          },
          {
            title: "gateway-wizard-register-partner",
            subtitle: "",
            content: (
              <InstructionModal step={2} configuration={configuration} />
            ),
            isInformation: true,
          },
          {
            title: "gateway-wizard-configure-partner",
            subtitle: "",
            content: (
              <InstructionModal step={3} configuration={configuration} />
            ),
            isInformation: true,
          },
          {
            title: "gateway-wizard-add-payment-method",
            subtitle: "gateway-wizard-add-payment-method-subtitle",
            content: <SettingsModal configuration={configuration} />,
          },
        ],
        dynamicStepAmount: false,
        reset: () => {
          configuration.gateway?.fields.forEach((field) => {
            field.value = "";
          });
          configuration.gateway = null;
        },
        finish: () => {
          configuration.save();
          return Promise.resolve();
        },
        continuationContext: continuation,
      }),
  );
  return (
    <ContinuationContext.Provider value={continuation}>
      <div className={`${classes.sectionname}`}>
        {t("gateway-fiat-currency")}
      </div>
      <CardList>
        <ExisingGateways configuration={configuration} type="fiat" />
        <CardButton
          onClick={() => {
            wizardConfiguration.next();
          }}
        >
          {t("common-add")}
        </CardButton>
      </CardList>
      <Wizard configurationStore={wizardConfiguration} />
    </ContinuationContext.Provider>
  );
}

export function CryptoGatewaysSection({
  configuration,
}: {
  configuration: PaymentGatewayConfigurationStore;
}) {
  const { t } = useTranslation();
  const [continuation] = useState<Continuation>(new Continuation());
  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    () =>
      new WizardConfigurationStore({
        steps: [
          {
            title: "gateway-wizard-add-donation-method",
            subtitle: "gateway-wizard-choose-partner-subtitle",
            content: (
              <ChooseGatewayModal type="crypto" configuration={configuration} />
            ),
            handler: () => {
              return Promise.resolve(true);
            },
          },
          {
            title: "gateway-wizard-register-partner",
            subtitle: "",
            content: (
              <InstructionModal step={2} configuration={configuration} />
            ),
            isInformation: true,
          },
          {
            title: "gateway-wizard-configure-partner",
            subtitle: "",
            content: (
              <InstructionModal step={3} configuration={configuration} />
            ),
            isInformation: true,
          },
          {
            title: "gateway-wizard-add-payment-method",
            subtitle: "gateway-wizard-add-payment-method-subtitle",
            content: <SettingsModal configuration={configuration} />,
          },
        ],
        dynamicStepAmount: false,
        reset: () => {
          configuration.gateway?.fields.forEach((field) => {
            field.value = "";
          });
          configuration.gateway = null;
        },
        finish: () => {
          configuration.save();
          return Promise.resolve();
        },
        continuationContext: continuation,
      }),
  );
  return (
    <ContinuationContext.Provider value={continuation}>
      <div className={`${classes.sectionname}`}>
        {t("gateway-crypto-currency")}
      </div>
      <CardList>
        <ExisingGateways configuration={configuration} type="crypto" />
        <CardButton
          onClick={() => {
            wizardConfiguration.next();
          }}
        >
          {t("common-add")}
        </CardButton>
      </CardList>
      <Wizard configurationStore={wizardConfiguration} />
    </ContinuationContext.Provider>
  );
}
