import { observer } from "mobx-react-lite";
import classes from "./RuleComponent.module.css";
import { AutomationRule } from "./AutomationState";
import { Button, Flex, Select } from "antd";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";

const RuleComponent = observer(({ rule }: { rule: AutomationRule }) => {
  return (
    <>
      <div className={`${classes.rulename}`}>{rule.name}</div>
      <div className={`${classes.rule}`}>
        <Flex vertical>
          <Flex className={`${classes.ruletrigger}`} vertical gap={10}>
            <LabeledContainer displayName="Условие срабатывания">
              <Select
                className="full-width"
                options={[
                  {
                    label: "Новый донат",
                    value: "new-donation",
                  },
                  {
                    label: "Заполнен донатгол",
                    value: "donationgoal-filled",
                  },
                ]}
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
                options={[
                  {
                    label: "Запустить алерт",
                    value: "run-alert",
                  },
                  {
                    label: "Обновить донатгол",
                    value: "update-donationgoal",
                  },
                ]}
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
