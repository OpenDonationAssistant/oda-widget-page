import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { Flex } from "antd";
import { AutomationState } from "./AutomationState";
import RuleComponent from "./RuleComponent";
import { observer } from "mobx-react-lite";
import classes from "./AutomationPage.module.css";

const AutomationPage = observer(({ state }: { state: AutomationState }) => {
  const { t } = useTranslation();

  return (
    <Content>
      <Flex vertical className={`${classes.container}`}>
        {state.rules.map((rule) => (
          <RuleComponent rule={rule} />
        ))}
        <div
          className={`oda-btn-default ${classes.addbutton}`}
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
    </Content>
  );
});

export default AutomationPage;
