import { observer } from "mobx-react-lite";
import classes from "./PaymentGatewaysConfiguration.module.css";
import { Button, Col, Flex, Input, Row, Switch } from "antd";
import Modal from "../../components/Modal/Modal";
import {
  GatewayInfo,
  Instruction,
  PaymentGatewayConfigurationStore,
} from "./PaymentGatewayConfigurationStore";
import CheckIcon from "../../icons/CheckIcon";
import { ReactNode, useContext, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { log } from "../../logging";
import CloseIcon from "../../icons/CloseIcon";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../components/Overlay/Overlay";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton/SecondaryButton";
import { reaction } from "mobx";

const SettingsModal = observer(
  ({ configuration }: { configuration: PaymentGatewayConfigurationStore }) => {
    return (
      <Modal
        title="Добавить способ оплаты"
        subtitle="Внесите технические настройки в Оду для подключения партнера"
        size="big"
        showDeclineButton={false}
        submitButtonText="Подключить"
        onSubmit={() => {
          configuration.save();
          configuration.step = 0;
        }}
        onDecline={() => {
          configuration.step = 0;
        }}
        note={<div>Шаг 4 из 4</div>}
        show={configuration.step === 4}
      >
        <Flex gap={36} vertical className="full-width">
          {configuration.gateways
            .filter((it) => it.id === configuration.gateway)
            .map((it) => (
              <FullGatewayInfoCard key={it.id} info={it} />
            ))}
          {configuration.gateways
            .filter((it) => it.id === configuration.gateway)
            .map((it) =>
              it.fields.map((field) => (
                <Flex key={field.id} vertical className="full-width">
                  <div className={`${classes.fieldname}`}>{field.name}</div>
                  <div className={`${classes.fieldcomment}`}>
                    {field.comment}
                  </div>
                  <Input
                    value={field.value}
                    className={`${classes.fieldvalue}`}
                    onChange={(e) => {
                      field.value = e.target.value;
                    }}
                  />
                </Flex>
              )),
            )}
        </Flex>
      </Modal>
    );
  },
);

const InstructionLine = observer(
  ({ instructions }: { instructions: Instruction[] }) => {
    return (
      <Flex gap={36} vertical>
        {instructions.map((line, index) => (
          <Flex key={index} vertical gap={6}>
            <div className={`${classes.instructionstatement}`}>
              {line.statement}
            </div>
            <div className={`${classes.instructioncomment}`}>
              {line.comment}
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

const ModalWrapper = observer(
  ({
    children,
    subtitle,
    configuration,
  }: {
    children: ReactNode;
    subtitle: string;
    configuration: PaymentGatewayConfigurationStore;
  }) => {
    const dialogState = useContext(ModalStateContext);

    return (
      <Overlay>
        <Panel>
          <Title>
            <Flex className="full-width" justify="space-between">
              <div>Добавить способ оплаты</div>
              <NotBorderedIconButton
                onClick={() => {
                  dialogState.show = false;
                }}
              >
                <CloseIcon color="var(--oda-color-1000)" />
              </NotBorderedIconButton>
            </Flex>
          </Title>
          <div className={`${classes.subtitle}`}>{subtitle}</div>
          {children}
          <Flex className={`${classes.buttons}`}>
            <div>Шаг {configuration.step} из 4</div>
            <Flex gap={12} justify="flex-end" align="center">
              <SecondaryButton
                onClick={() => {
                  dialogState.show = false;
                  configuration.step = 0;
                }}
              >
                Отмена
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  dialogState.show = false;
                  configuration.step = configuration.step + 1;
                }}
              >
                Далее
              </PrimaryButton>
            </Flex>
          </Flex>
        </Panel>
      </Overlay>
    );
  },
);

const InstructionModal = observer(
  ({
    subtitle,
    step,
    configuration,
  }: {
    subtitle: string;
    step: number;
    configuration: PaymentGatewayConfigurationStore;
  }) => {
    const parentModalState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    reaction(
      () => configuration.step,
      () => {
        if (configuration.step === step) {
          dialogState.show = true;
        }
      },
    );

    return (
      <ModalStateContext.Provider value={dialogState}>
        <ModalWrapper subtitle={subtitle} configuration={configuration}>
          <Flex vertical className="full-width" gap={42}>
            {configuration.gateways
              .filter((it) => it.id === configuration.gateway)
              .map((it) => (
                <FullGatewayInfoCard key={it.id} info={it} />
              ))}
            {configuration.gateways
              .filter((it) => it.id === configuration.gateway)
              .map((it) => (
                <InstructionLine
                  key={it.id}
                  instructions={it.instructions.get(configuration.step) ?? []}
                />
              ))}
          </Flex>
        </ModalWrapper>
      </ModalStateContext.Provider>
    );
  },
);

const FullGatewayInfoCard = observer(({ info }: { info: GatewayInfo }) => {
  return (
    <div className={`${classes.card}`}>
      <div className={`${classes.choosenmethod}`}>Выбранный способ оплаты:</div>
      <Flex vertical justify="flex-end">
        <Flex align="center" justify="space-between">
          <div className={`${classes.gatewayname}`}>{info.name}</div>
        </Flex>
        <Flex vertical gap={3}>
          {info.goodpoints.map((it) => (
            <div className={`${classes.selectedgoodpoint}`}>{it}</div>
          ))}
          {info.badpoints.map((it) => (
            <div className={`${classes.badpoint}`}>{it}</div>
          ))}
        </Flex>
      </Flex>
    </div>
  );
});

const GatewayCard = observer(
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
    return (
      <Col
        span={7}
        className={`${classes.card} ${!onDelete && classes.hover} ${selected ? classes.selected : classes.notselected}`}
        onClick={() => {
          if (!onDelete) onClick();
        }}
      >
        <Flex vertical gap={36}>
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={12} justify="flex-start">
              <div className={`${classes.gatewayname}`}>{info.name}</div>
              {onDelete && <Switch value={selected} onClick={onClick} />}
            </Flex>
            {onDelete && (
              <BorderedIconButton onClick={onDelete}>
                <CloseIcon color="#FF8888" />
              </BorderedIconButton>
            )}
            {!onDelete && selected && (
              <div className={`${classes.iconbackground}`}>
                <CheckIcon color="var(--oda-color-0)" />
              </div>
            )}
          </Flex>
          <Flex vertical gap={3}>
            {info.goodpoints.map((it) => (
              <div className={`${classes.goodpoint}`}>{it}</div>
            ))}
            {info.badpoints.map((it) => (
              <div className={`${classes.badpoint}`}>{it}</div>
            ))}
          </Flex>
        </Flex>
      </Col>
    );
  },
);

const ChooseGatewayModal = observer(
  ({
    type,
    configuration,
  }: {
    type: string;
    configuration: PaymentGatewayConfigurationStore;
  }) => {
    const parentModalState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    return (
      <>
        <ModalStateContext.Provider value={dialogState}>
          <Overlay>
            <Panel>
              <Title>
                <Flex className="full-width" justify="space-between">
                  <div>Добавить способ оплаты</div>
                  <NotBorderedIconButton
                    onClick={() => {
                      dialogState.show = false;
                    }}
                  >
                    <CloseIcon color="var(--oda-color-1000)" />
                  </NotBorderedIconButton>
                </Flex>
              </Title>
              <div className={`${classes.subtitle}`}>
                Выберите партнера, через которого будет осуществляться прием
                донатов
              </div>
              <Row className={`${classes.grid}`}>
                {configuration.gateways
                  .filter((it) => it.type === type)
                  .map((it) => (
                    <GatewayCard
                      key={it.id}
                      info={it}
                      selected={configuration.gateway === it.id}
                      onClick={() => {
                        configuration.gateway =
                          configuration.gateway === it.id ? null : it.id;
                      }}
                    />
                  ))}
              </Row>
              <Flex className={`${classes.buttons}`}>
                <div>Шаг 1 из 4</div>
                <PrimaryButton
                  onClick={() => {
                    dialogState.show = false;
                    configuration.step = 2;
                  }}
                >
                  Далее
                </PrimaryButton>
              </Flex>
            </Panel>
          </Overlay>
          <Button
            className={`${classes.addbutton}`}
            onClick={() => {
              dialogState.show = true;
            }}
          >
            <Flex
              vertical
              justify="center"
              align="center"
              gap={3}
              className="full-height"
            >
              <span className="material-symbols-sharp">add</span>
              <div>Добавить</div>
            </Flex>
          </Button>
        </ModalStateContext.Provider>
      </>
    );
  },
);

const ExisingGateways = observer(
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

const PaymentGatewaysConfiguration = observer(({}) => {
  const { recipientId } = useLoaderData() as WidgetData;
  const configuration = useRef(
    new PaymentGatewayConfigurationStore(recipientId),
  );

  log.debug({ conf: configuration.current.configurations });

  return (
    <>
      <Flex vertical gap={9}>
        <h1 className={`${classes.header}`}>Способы оплаты</h1>
        <div className={`${classes.sectionname}`}>
          Фиатная валюта (RUB, USD, etc)
        </div>
        <Flex gap={12} wrap>
          <ExisingGateways configuration={configuration.current} type="fiat" />
          <ChooseGatewayModal
            type="fiat"
            configuration={configuration.current}
          />
        </Flex>
        <div className={`${classes.sectionname} hidden`}>
          Криптовалюта (Bitcoin, Etherium, TON, etc)
        </div>
      </Flex>
      <InstructionModal
        subtitle="Зарегистрируйте аккаунт у партнера"
        step={2}
        configuration={configuration.current}
      />
      <InstructionModal
        subtitle="Внесите необходимые настройки в личном кабинете партнера"
        step={3}
        configuration={configuration.current}
      />
      <SettingsModal configuration={configuration.current} />
    </>
  );
});

export default PaymentGatewaysConfiguration;
