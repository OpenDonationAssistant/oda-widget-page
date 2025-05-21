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
import { useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { log } from "../../logging";
import CloseIcon from "../../icons/CloseIcon";
import IconButton from "../../components/IconButton/IconButton";

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

const InstructionModal = observer(
  ({
    subtitle,
    step,
    nextStep,
    configuration,
  }: {
    subtitle: string;
    step: number;
    nextStep: number;
    configuration: PaymentGatewayConfigurationStore;
  }) => {
    return (
      <Modal
        title="Добавить способ оплаты"
        subtitle={subtitle}
        size="big"
        showDeclineButton={false}
        submitButtonText="Далее"
        onSubmit={() => {
          configuration.step = nextStep;
        }}
        onDecline={() => {
          configuration.step = 0;
        }}
        note={<div>Шаг {step} из 4</div>}
        show={configuration.step === step}
      >
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
      </Modal>
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
              <IconButton onClick={onDelete}>
                <CloseIcon color="#FF8888" />
              </IconButton>
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
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
      <>
        <Modal
          title="Добавить способ оплаты"
          subtitle="Выберите партнера, через которого будет осуществляться прием донатов"
          size="big"
          showDeclineButton={false}
          submitButtonText="Далее"
          onSubmit={() => {
            setShowModal(false);
            configuration.step = 2;
          }}
          onDecline={() => {
            setShowModal(false);
          }}
          note={<div>Шаг 1 из 4</div>}
          show={showModal}
        >
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
        </Modal>
        <Button
          className={`${classes.addbutton}`}
          onClick={() => {
            setShowModal(true);
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
        nextStep={3}
        configuration={configuration.current}
      />
      <InstructionModal
        subtitle="Внесите необходимые настройки в личном кабинете партнера"
        step={3}
        nextStep={4}
        configuration={configuration.current}
      />
      <SettingsModal configuration={configuration.current} />
    </>
  );
});

export default PaymentGatewaysConfiguration;
