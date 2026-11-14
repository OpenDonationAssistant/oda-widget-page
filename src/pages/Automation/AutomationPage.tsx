import { useTranslation } from "react-i18next";
import { Button, Flex, Modal, Input, Switch, Tabs } from "antd";
import { Variable, useAutomationState } from "./AutomationState";
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
import SecondaryButton from "../../components/Button/SecondaryButton";
import SubActionButton from "../../components/Button/SubActionButton";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Warning,
} from "../../components/Overlay/Overlay";
import {
  AddListItemButton,
  CollapsibleListItem,
  List,
} from "../../components/List/List";

const VariableComponent = observer(({ variable }: { variable: Variable }) => {
  const { t } = useTranslation();
  const { state } = useAutomationState();

  return (
    <Flex
      className={`${classes.variablecontainer} full-width`}
      justify="space-between"
      align="center"
    >
      <Flex style={{ flexGrow: 1 }}>
        <EditableString
          label={
            variable.name ? variable.name : t("automation-variable-untitled")
          }
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
            placeholder={t("automation-variable-empty-placeholder")}
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

const RuleList = observer(() => {
  const { state } = useAutomationState();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { t } = useTranslation();
  const toggleModal = () => {
    setShowModal((old) => !old);
  };
  const parentModalState = useContext(ModalStateContext);
  const [deleteRuleDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );

  return (
    <Flex
      vertical
      className={`${classes.container}`}
      align="flex-start"
      gap={3}
    >
      {state.rules.map((rule, index) => (
        <List key={rule.id}>
          <CollapsibleListItem
            title={
              <>
                <Flex className={`full-width`} align="center">
                  <div>{rule.name}</div>
                  <Modal
                    className={`${classes.helpmodal}`}
                    title={t("automation-rename-rule")}
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
                  <Switch
                    checked={rule.enabled}
                    onChange={(checked) =>
                      state.setRuleEnabled(rule.id, checked)
                    }
                  />
                </Flex>
              </>
            }
            actions={
              <>
                <ModalStateContext.Provider value={deleteRuleDialogState}>
                  <Overlay>
                    <Warning
                      action={() => {
                        state.removeRule(index);
                        deleteRuleDialogState.show = false;
                      }}
                    >
                      {t("automation-delete-rule-confirm")}
                    </Warning>
                  </Overlay>
                </ModalStateContext.Provider>
                <SubActionButton
                  onClick={() => (deleteRuleDialogState.show = true)}
                  icon={<CloseIcon color="#FF8888" />}
                >
                  <span style={{ color: "#FF8888" }}>{t("button-delete")}</span>
                </SubActionButton>
              </>
            }
          >
            <RuleComponent rule={rule} />
          </CollapsibleListItem>
        </List>
      ))}
      <AddListItemButton
        onClick={() => {
          state.addRule();
        }}
        label={t("button-add-automation-rule")}
      />
    </Flex>
  );
});

const VariableList = observer(({ type }: { type: "string" | "number" }) => {
  const { state } = useAutomationState();

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

const AutomationPage = observer(() => {
  const { t } = useTranslation();
  const { state } = useAutomationState();
  const widgetStore = new DefaultWidgetStore();

  return (
    <WidgetStoreContext.Provider value={widgetStore}>
      <h1>{t("menu-automation")}</h1>

      <Tabs
        tabBarExtraContent={
          <SecondaryButton
            onClick={() => {
              state.save();
            }}
          >
            {t("button-save")}
          </SecondaryButton>
        }
        type="card"
        items={[
          {
            label: t("automation-tab-rules"),
            key: "rules",
            children: <RuleList />,
          },
          {
            label: t("automation-tab-variables"),
            key: "variables",
            children: (
              <Flex vertical className={`${classes.variabletab}`}>
                <div className={`${classes.variablesectionname}`}>
                  {t("automation-variables-numbers")}
                </div>
                <VariableList type="number" />
                <div className={`${classes.variablesectionname}`}>
                  {t("automation-variables-strings")}
                </div>
                <VariableList type="string" />
              </Flex>
            ),
          },
        ]}
      />
    </WidgetStoreContext.Provider>
  );
});

export default AutomationPage;
