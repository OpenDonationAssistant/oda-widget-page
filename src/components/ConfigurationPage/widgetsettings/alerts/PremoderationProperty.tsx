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
      displayName: 'Режим "Премодерации"',
      help: "Если режим включен, алерты не будут показываться на экране, сообщение не будет зачитываться вслух, НО будет короткий звуковой сигнал, помогающий понять, что донат пришел. Если захочется его показать на экране, достаточно нажать кнопку 'Повторить' в разделе 'История' или в виджете 'События'",
    });
  }

  comp = observer(() => (
    <Flex>
      <LightLabeledSwitchComponent
        label="Режим премодерации"
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
