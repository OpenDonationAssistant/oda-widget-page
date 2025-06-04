import { useTranslation } from "react-i18next";
import { Button, Flex, Modal, Input, Tabs } from "antd";
import {
  AutomationState,
  AutomationStateContext,
  Variable,
} from "./AutomationState";
import RuleComponent from "./RuleComponent";
import { observer } from "mobx-react-lite";
import classes from "./AutomationPage.module.css";
import { useContext, useState } from "react";
import { EditableString } from "../../components/RenamableLabel/EditableString";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import EditIcon from "../../icons/EditIcon";
import "../../ant.css";
import "../../newstyle.css";
import CloseIcon from "../../icons/CloseIcon";
import {
  DefaultWidgetStore,
  WidgetStoreContext,
} from "../../stores/WidgetStore";
import SecondaryButton from "../../components/SecondaryButton/SecondaryButton";
import SubActionButton from "../../components/SubActionButton/SubActionButton";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Warning,
} from "../../components/Overlay/Overlay";

const VariableComponent = observer(({ variable }: { variable: Variable }) => {
  const state = useContext(AutomationStateContext);

  return (
    <Flex
      className={`${classes.variablecontainer} full-width`}
      justify="space-between"
      align="center"
    >
      <Flex style={{ flexGrow: 1 }}>
        <EditableString
          label={variable.name ? variable.name : "<Без названия>"}
          onChange={(value) => {
            variable.name = value;
          }}
        />
      </Flex>
      <Flex
        className={`${classes.variablevalue}`}
        justify="flex-end"
        align="center"
        gap={9}
      >
        {variable.type === "string" && (
          <Input
            value={variable.value as string}
            placeholder="<пусто>"
            onChange={(e) => {
              variable.value = e.target.value;
            }}
          />
        )}
        {variable.type === "number" && (
          <InputNumber
            value={(variable.value as number) ?? 0}
            onChange={(newValue) => {
              variable.value = newValue;
            }}
          />
        )}
        <Button
          className={`${classes.deletevariable} oda-icon-button`}
          style={{ background: "#231717" }}
          onClick={() => {
            state.removeVariable(variable.id);
          }}
        >
          <CloseIcon color="white" />
        </Button>
      </Flex>
    </Flex>
  );
});

const RuleList = observer(({}) => {
  const state = useContext(AutomationStateContext);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { t } = useTranslation();
  const toggleModal = () => {
    setShowModal((old) => !old);
  };
  const parentModalState = useContext(ModalStateContext);
  const [deleteRuleDialogState, setDeleteRuleDialogState] =
    useState<ModalState>(new ModalState(parentModalState.level));

  return (
    <Flex vertical className={`${classes.container}`} align="flex-start">
      {state.rules.map((rule, index) => (
        <Flex key={rule.id} vertical className={`${classes.rulecontainer}`}>
          <Flex className={`${classes.rulename}`} justify="space-between">
            <Flex align="center">
              <div>{rule.name}</div>
              <Modal
                className={`${classes.helpmodal}`}
                title="rename-rule"
                open={showModal}
                onCancel={toggleModal}
                onClose={toggleModal}
                onOk={toggleModal}
              >
                <Input
                  value={rule.name}
                  onChange={(value) => {
                    rule.name = value.target.value;
                  }}
                />
              </Modal>
              <Button
                className={`${classes.rename} oda-icon-button`}
                onClick={() => toggleModal()}
              >
                <EditIcon />
              </Button>
            </Flex>
            <div>
              <ModalStateContext.Provider value={deleteRuleDialogState}>
                <Overlay>
                  <Warning action={() => state.removeRule(index)}>
                    Вы точно хотите удалить правило?
                  </Warning>
                </Overlay>
              </ModalStateContext.Provider>
              <SubActionButton
                onClick={() => (deleteRuleDialogState.show = true)}
              >
                <CloseIcon color="#FF8888" />
                <span style={{ color: "#FF8888" }}>Удалить</span>
              </SubActionButton>
            </div>
          </Flex>
          <RuleComponent rule={rule} />
        </Flex>
      ))}
      <div
        className={`${classes.addbutton}`}
        onClick={() => {
          state.addRule();
        }}
      >
        <Flex justify="center" align="center" gap={3} className="full-height">
          <span className="material-symbols-sharp">add</span>
          <div>{t("button-add-automation-rule")}</div>
        </Flex>
      </div>
    </Flex>
  );
});

const VariableList = observer(({ type }: { type: "string" | "number" }) => {
  const state = useContext(AutomationStateContext);

  return (
    <Flex vertical className={`${classes.container}`}>
      {state.variables
        .filter((variable) => variable.type === type)
        .map((variable) => {
          return <VariableComponent key={variable.id} variable={variable} />;
        })}
      <Flex
        className={`${classes.addvariable} full-width`}
        justify="center"
        align="center"
        onClick={() => {
          state.addVariable(type);
        }}
      >
        <span className="material-symbols-sharp">add</span>
      </Flex>
    </Flex>
  );
});

const AutomationPage = observer(({}) => {
  const state = new AutomationState(true);
  const widgetStore = new DefaultWidgetStore();

  return (
    <AutomationStateContext.Provider value={state}>
      <WidgetStoreContext.Provider value={widgetStore}>
        <h1>Автоматизация</h1>

        <Tabs
          tabBarExtraContent={
            <SecondaryButton
              onClick={() => {
                state.save();
              }}
            >
              Сохранить
            </SecondaryButton>
          }
          type="card"
          items={[
            {
              label: "Правила",
              key: "rules",
              children: <RuleList />,
            },
            {
              label: "Переменные",
              key: "variables",
              children: (
                <Flex vertical className={`${classes.variabletab}`}>
                  <div className={`${classes.variablesectionname}`}>Числа</div>
                  <VariableList type="number" />
                  <div className={`${classes.variablesectionname}`}>Строки</div>
                  <VariableList type="string" />
                </Flex>
              ),
            },
          ]}
        />
      </WidgetStoreContext.Provider>
    </AutomationStateContext.Provider>
  );
});

export default AutomationPage;
