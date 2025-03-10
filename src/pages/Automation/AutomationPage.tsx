import { Content } from "antd/es/layout/layout";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";
import { Flex } from "antd";
import { AutomationState } from "./AutomationState";
import RuleComponent from "./RuleComponent";
import { observer } from "mobx-react-lite";
import classes from "./AutomationPage.module.css";

const AutomationPage = observer(({ state }: { state: AutomationState }) => {
  const { recipientId } = useLoaderData() as WidgetData;
  const { t } = useTranslation();

  function addRule() {
    state.addRule();
  }

  return (
    <Content>
      <Flex vertical gap={10} className={`${classes.container}`}>
        {state.rules.map((rule) => (
          <RuleComponent rule={rule} />
        ))}
        <div
          className="oda-btn-default"
          onClick={() => addRule()}
          style={{
            marginTop: "20px",
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
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
