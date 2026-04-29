import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import { LightLabeledSwitchComponent } from "../../../LabeledSwitch/LabeledSwitchComponent";
import InputNumber from "../../components/InputNumber";

export interface MaxLenValue {
  limitLen: boolean;
  limit: number;
}

const MaxLenComponent = observer(({ property }: { property: MaxLen }) => {
  return (
    <>
      <LightLabeledSwitchComponent
        label="Ограничение по длине"
        value={property.value.limitLen}
        onChange={(update) => {
          property.value.limitLen = update;
        }}
      />
      {property.value.limitLen && (
        <InputNumber
          value={property.value.limit}
          addon="сек"
          onChange={(update) => {
            property.value.limit = update;
          }}
        />
      )}
    </>
  );
});

export class MaxLen extends DefaultWidgetProperty<MaxLenValue> {
  constructor() {
    super({
      name: "maxLen",
      value: {
        limitLen: false,
      },
      displayName: "Ограничение по длине",
    });
  }

  markup(): ReactNode {
    return <MaxLenComponent property={this} />;
  }
}
