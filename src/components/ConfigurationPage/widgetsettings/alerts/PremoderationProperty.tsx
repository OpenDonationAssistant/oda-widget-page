import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { Segmented } from "antd";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { produce } from "immer";

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
    <LabeledContainer displayName="Режим премодерации">
      <Segmented
        className="full-width"
        options={[
          { value: 0, label: "Выключен" },
          { value: 1, label: "Включен" },
        ]}
        value={this.value.enabled ? 1 : 0}
        onChange={(newValue) => {
          this.value = produce(this.value, (draft) => {
            draft.enabled = newValue === 1;
          });
        }}
      />
    </LabeledContainer>
  ));

  copy() {
    return new PremoderationProperty({ value: this.value });
  }

  markup(): ReactNode {
    return <this.comp />;
  }
}
