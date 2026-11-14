import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { Flex } from "antd";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { produce } from "immer";
import { LightLabeledSwitchComponent } from "../../../LabeledSwitch/LabeledSwitchComponent";

export interface PremoderationPropertyValue {
  enabled: boolean;
}

export class PremoderationProperty extends DefaultWidgetProperty<PremoderationPropertyValue> {
  constructor(params: { value?: PremoderationPropertyValue }) {
    super({
      name: "premoderation",
      value: params.value ? params.value.enabled : { enabled: false },
      displayName: "alerts-premoderation-mode",
      help: "alerts-premoderation-help",
    });
  }

  comp = observer(() => (
    <Flex>
      <LightLabeledSwitchComponent
        label="alerts-premoderation-label"
        value={this.value.enabled}
        onChange={(newValue) => {
          this.value = produce(toJS(this.value), (draft) => {
            draft.enabled = newValue;
          });
        }}
      />
    </Flex>
  ));

  copy() {
    return new PremoderationProperty({ value: this.value });
  }

  markup(): ReactNode {
    return <this.comp />;
  }
}
