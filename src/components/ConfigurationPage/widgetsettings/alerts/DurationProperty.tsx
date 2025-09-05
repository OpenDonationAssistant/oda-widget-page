import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { produce } from "immer";
import InputNumber from "../../components/InputNumber";
import { LightLabeledSwitchComponent } from "../../../LabeledSwitch/LabeledSwitchComponent";
import { Flex } from "antd";

const DurationPropertyComponent = observer(
  ({ property }: { property: DurationProperty }) => {
    return (
      <Flex vertical gap={9}>
        <LightLabeledSwitchComponent
          label={property.displayName}
          value={property.value.limited}
          onChange={(update) => {
            property.value = produce(toJS(property.value), (draft) => {
              draft.limited = update;
              if (!draft.limited) {
                draft.time = 0;
              }
            });
          }}
        />
        {property.value.limited && (
          <InputNumber
            increment={1000}
            value={property.value.time ?? 0}
            addon="ms"
            onChange={(update) => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.time = update;
              });
            }}
          />
        )}
      </Flex>
    );
  },
);

export interface DurationPropertyValue {
  limited: boolean;
  time: number;
}

export class DurationProperty extends DefaultWidgetProperty<DurationPropertyValue> {
  constructor({ name, displayName }: { name?: string; displayName?: string }) {
    super({
      name: name ?? "duration",
      value: {
        limited: false,
        time: 0,
      },
      displayName: displayName ?? "duration",
    });
  }

  markup(): ReactNode {
    return <DurationPropertyComponent property={this} />;
  }
}
