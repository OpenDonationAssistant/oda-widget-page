import { observer } from "mobx-react-lite";
import { Alert } from "./Alerts";
import { Flex } from "antd";
import { LayoutProperty } from "./LayoutProperty";

export const LayoutTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <Flex vertical>
      <div className="settings-item">
        {(alert.get("layout") as LayoutProperty).markup()}
      </div>
    </Flex>
  );
});
