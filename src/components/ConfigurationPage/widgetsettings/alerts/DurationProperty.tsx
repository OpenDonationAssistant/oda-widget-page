import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import { Flex, Switch } from "antd";
import { toJS } from "mobx";
import { produce } from "immer";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";

const DurationPropertyComponent = observer(
  ({ property }: { property: DurationProperty }) => {
    return (
      <div className={`settings-item`}>
        <LabeledContainer displayName={property.displayName}>
          <Flex
            justify="space-between"
            style={{ width: "100%" }}
            align="center"
          >
            <Flex gap={10}>
              <Switch
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
              <div>Задать</div>
            </Flex>
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
        </LabeledContainer>
      </div>
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
