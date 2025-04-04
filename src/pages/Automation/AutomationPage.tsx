import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { Button, Flex, Modal, Input, Tabs } from "antd";
import { AutomationState, AutomationStateContext, Variable } from "./AutomationState";
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
import { log } from "../../logging";
import { toJS } from "mobx";

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
          className={`${classes.deletevariable}`}
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

  return (
    <Flex vertical className={`${classes.container}`} align="flex-start">
      {state.rules.map((rule, index) => (
        <Flex vertical className={`${classes.rulecontainer}`}>
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
                className={`${classes.rename}`}
                onClick={() => toggleModal()}
              >
                <EditIcon />
              </Button>
            </Flex>
            <div>
              <Button
                className={`${classes.delete}`}
                onClick={() => state.removeRule(index)}
              >
                <CloseIcon color="#FF8888" />
              </Button>
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
        <Flex justify="center" align="center" gap={3}>
          <span className="material-symbols-sharp">add</span>
          <div>{t("button-add-automation-rule")}</div>
        </Flex>
      </div>
    </Flex>
  );
});

const VariableList = observer(({ type }: { type: "string" | "number" }) => {
  const state = useContext(AutomationStateContext);
  const { t } = useTranslation();

  return (
    <Flex vertical className={`${classes.container}`}>
      {state.variables
        .filter((variable) => variable.type === type)
        .map((variable) => {
          return <VariableComponent variable={variable} />;
        })}
      <Flex
        style={{ marginTop: "24px" }}
        className="full-width"
        justify="center"
        gap={10}
      >
        <div
          className={`oda-btn-default`}
          onClick={() => {
            state.addVariable(type);
          }}
        >
          <Flex className="full-width" justify="center" align="center" gap={3}>
            <span className="material-symbols-sharp">add</span>
            <div>{t("button-add-variable-rule")}</div>
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
});

const AutomationPage = observer(({}) => {
  const state = new AutomationState(true);

  return (
    <AutomationStateContext.Provider value={state}>
      <Content className={`${classes.content} newstyle`}>
        <Flex justify="space-between">
          <h1>Автоматизация</h1>
          <div>
            <button
              className="oda-btn-default"
              onClick={() => {
                state.save();
              }}
            >
              Сохранить
            </button>
          </div>
        </Flex>

        <Tabs
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
      </Content>
    </AutomationStateContext.Provider>
  );
});

export default AutomationPage;
