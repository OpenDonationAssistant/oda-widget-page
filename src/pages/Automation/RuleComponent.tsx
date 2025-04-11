import { observer } from "mobx-react-lite";
import classes from "./RuleComponent.module.css";
import {
  AutomationAction,
  AutomationRule,
  AutomationTrigger,
} from "./AutomationState";
import { Button, Flex, Select } from "antd";
import { useContext, useState } from "react";
import { AutomationTriggerControllerContext } from "./AutomationTriggerController";
import { AutomationActionControllerContext } from "./AutomationActionController";
import Modal from "../../components/Modal/Modal";
import { Renderable } from "../../utils";
import {
  SelectedIndexContext,
  SelectedIndexStore,
} from "../../stores/SelectedIndexStore";
import { reaction } from "mobx";
import CloseIcon from "../../icons/CloseIcon";
import { log } from "../../logging";

const TriggerModal = observer(({ rule }: { rule: AutomationRule }) => {
  const triggerController = useContext(AutomationTriggerControllerContext);
  const index = useContext(SelectedIndexContext);

  const [triggerId, setTriggerId] = useState<string>("");
  const [trigger, setTrigger] = useState<
    (AutomationTrigger & Renderable) | null
  >(null);

  reaction(
    () => index.index,
    () => {
      log.debug({ index: index.index }, "new trigger selected index");
      if (index.index != null) {
        if (index.index == rule.triggers.length) {
          setTrigger(null);
          setTriggerId("");
        } else {
          const previous = rule.triggers[index.index];
          setTrigger(previous);
          setTriggerId(previous.id ?? "");
        }
      }
    },
  );

  return (
    <Modal
      size="normal"
      title={`Действие в ${rule.name}`}
      show={index.index != null}
      onSubmit={() => {
        if (index.index != null) {
          log.debug({ trigger }, "settings trigger in automation rule");
          rule.setTrigger(trigger, index.index);
        }
        index.index = null;
      }}
      onDecline={() => {
        index.index = null;
      }}
    >
      <Flex vertical className="full-width" gap={9}>
        <Select
          value={triggerId}
          className="full-width"
          options={triggerController.triggers.map((option) => {
            return {
              label: option.name,
              value: option.id,
            };
          })}
          onChange={(id) => {
            setTriggerId(id);
            setTrigger(
              triggerController.triggers.find((trigger) => trigger.id === id) ??
                null,
            );
          }}
        />
        {trigger?.markup}
      </Flex>
    </Modal>
  );
});

const ActionModal = observer(({ rule }: { rule: AutomationRule }) => {
  const actionController = useContext(AutomationActionControllerContext);
  const index = useContext(SelectedIndexContext);

  const [actionId, setActionId] = useState<string>("");
  const [action, setAction] = useState<(AutomationAction & Renderable) | null>(
    null,
  );

  reaction(
    () => index.index,
    () => {
      if (index.index != null) {
        const previous = rule.actions[index.index];
        setAction(previous);
        setActionId(previous.id ?? "");
      }
    },
  );

  return (
    <Modal
      size="normal"
      title={`Действие в ${rule.name}`}
      show={index.index != null}
      onSubmit={() => {
        if (index.index != null) {
          log.debug({ action }, "settings action in automation rule");
          rule.setAction(action, index.index);
        }
        index.index = null;
      }}
      onDecline={() => {
        index.index = null;
      }}
    >
      <Flex vertical className="full-width" gap={9}>
        <Select
          value={actionId}
          className="full-width"
          options={actionController.actions.map((option) => {
            return {
              label: option.name,
              value: option.id,
            };
          })}
          onChange={(id) => {
            setActionId(id);
            setAction(
              actionController.actions.find((action) => action.id === id) ??
                null,
            );
          }}
        />
        {action?.markup}
      </Flex>
    </Modal>
  );
});

const RuleComponent = observer(({ rule }: { rule: AutomationRule }) => {
  const [selectedIndex] = useState<SelectedIndexStore>(
    new SelectedIndexStore(),
  );
  const [selectedAction] = useState<SelectedIndexStore>(
    new SelectedIndexStore(),
  );

  return (
    <>
      <div className={`${classes.rule}`}>
        <Flex vertical>
          <Flex className={`${classes.ruletrigger}`} vertical gap={9}>
            <span>Условия</span>
            <Flex>
              <SelectedIndexContext.Provider value={selectedIndex}>
                <TriggerModal rule={rule} />
                <Flex gap={6} className={`${classes.triggers}`} wrap>
                  {rule.triggers.map((trigger, index) => (
                    <div key={trigger.id} className={`${classes.triggercard}`}>
                      <Flex
                        className="full-width"
                        gap={10}
                        justify="space-between"
                      >
                        <div className={`${classes.triggername}`}>
                          {trigger.name ? trigger.name : "<Не выбрано>"}
                        </div>
                        <button
                          className={`${classes.closetrigger} oda-icon-button`}
                          onClick={() => rule.removeTrigger(index)}
                        >
                          <CloseIcon color="#FF8888" />
                        </button>
                      </Flex>
                      <button
                        onClick={() => {
                          log.debug(
                            { index: index },
                            "selecting trigger for edit",
                          );
                          selectedIndex.index = index;
                        }}
                        className={`${classes.edit}`}
                      >
                        Изменить
                      </button>
                    </div>
                  ))}
                  <Button
                    className={`${classes.add}`}
                    onClick={() => {
                      rule.addTrigger();
                      selectedIndex.index = rule.triggers.length - 1;
                    }}
                  >
                    <Flex vertical justify="center">
                      <span className="material-symbols-sharp">add</span>
                      <div>Добавить условие</div>
                    </Flex>
                  </Button>
                </Flex>
              </SelectedIndexContext.Provider>
            </Flex>
          </Flex>
          <Flex vertical gap={10} className={`${classes.rulebody}`}>
            <span>Действия</span>
            <Flex>
              <SelectedIndexContext.Provider value={selectedAction}>
                <ActionModal rule={rule} />
                <Flex gap={6} className={`${classes.triggers}`} wrap>
                  {rule.actions.map((action, index) => (
                    <div key={action.id} className={`${classes.triggercard}`}>
                      <Flex
                        className="full-width"
                        gap={10}
                        justify="space-between"
                      >
                        <div className={`${classes.triggername}`}>
                          {action.name ? action.name : "<Не выбрано>"}
                        </div>
                        <button
                          className={`${classes.closetrigger}`}
                          onClick={() => rule.removeAction(index)}
                        >
                          <CloseIcon color="#FF8888" />
                        </button>
                      </Flex>
                      <button
                        onClick={() => {
                          log.debug(
                            { index: index },
                            "selecting action for edit",
                          );
                          selectedAction.index = index;
                        }}
                        className={`${classes.edit}`}
                      >
                        Изменить
                      </button>
                    </div>
                  ))}
                  <Button
                    className={`${classes.add}`}
                    onClick={() => {
                      rule.addAction();
                      selectedAction.index = rule.actions.length - 1;
                    }}
                  >
                    <Flex vertical justify="center" align="center">
                      <span className="material-symbols-sharp">add</span>
                      <div>Добавить действие</div>
                    </Flex>
                  </Button>
                </Flex>
              </SelectedIndexContext.Provider>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </>
  );
});

export default RuleComponent;
