import { observer } from "mobx-react-lite";
import classes from "./RuleComponent.module.css";
import { AutomationRule } from "./AutomationState";
import { Button, Flex, Select } from "antd";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import { useContext } from "react";
import { AutomationTriggerControllerContext } from "./AutomationTriggerController";
import { AutomationActionControllerContext } from "./AutomationActionController";

const RuleComponent = observer(({ rule }: { rule: AutomationRule }) => {
  const triggerController = useContext(AutomationTriggerControllerContext);
  const actionController = useContext(AutomationActionControllerContext);

  return (
    <>
      <Flex className={`${classes.rulename}`} justify="space-between">
        <Flex>
          <div>{rule.name}</div>
          <Button className={`${classes.rename}`}>
            <span className="material-symbols-sharp">edit</span>
          </Button>
        </Flex>
        <div>
          <Button className={`${classes.rename}`}>
            <span className="material-symbols-sharp">delete</span>
          </Button>
        </div>
      </Flex>
      <div className={`${classes.rule}`}>
        <Flex vertical>
          <Flex className={`${classes.ruletrigger}`} vertical gap={10}>
            <LabeledContainer displayName="Условие срабатывания">
              <Select
                className="full-width"
                options={triggerController.triggers.map((trigger) => {
                  return {
                    label: trigger.name,
                    value: trigger.id,
                  };
                })}
              />
            </LabeledContainer>
            <Flex justify="center">
              <Button className={`${classes.add}`}>
                <Flex>
                  <span className="material-symbols-sharp">add</span>
                  <div>Добавить условие</div>
                </Flex>
              </Button>
            </Flex>
          </Flex>
          <Flex vertical gap={10} className={`${classes.rulebody}`}>
            <LabeledContainer displayName="Действие">
              <Select
                className="full-width"
                options={actionController.actions.map((action) => {
                  return {
                    label: action.name,
                    value: action.id,
                  };
                })}
              />
            </LabeledContainer>
            <Flex justify="center">
              <Button className={`${classes.add}`}>
                <Flex>
                  <span className="material-symbols-sharp">add</span>
                  <div>Добавить действие</div>
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </>
  );
});

export default RuleComponent;
