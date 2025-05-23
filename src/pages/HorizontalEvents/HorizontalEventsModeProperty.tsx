import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import { Flex, Segmented, Select } from "antd";
import { produce } from "immer";
import { toJS } from "mobx";
import classes from "./HorizontalEventsModeProperty.module.css";

const HorizontalEventsModePropertyComponent = observer(
  ({ property }: { property: HorizontalEventsModeProperty }) => {
    return (
      <>
        <LabeledContainer displayName="События для отображения" help={property.help}>
          <Segmented
            value={property.value.mode}
            className={`${classes.unitselector}`}
            onChange={(value) => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.mode = value;
              });
            }}
            options={[{ label: "За период", value: "period" }]}
          />
        </LabeledContainer>
        {property.value.mode === "period" && (
          <LabeledContainer displayName="Период" help={property.help}>
            <div>
              <Segmented
                value={property.value.period}
                options={[{ label: "Сутки", value: "day" }]}
                onChange={(value) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.period = value;
                  });
                }}
              />
            </div>
          </LabeledContainer>
        )}
      </>
    );
  },
);

interface HorizontalEventsMode {
  mode: "period" | "last";
  period: "day";
}

// TODO: 18n
export class HorizontalEventsModeProperty extends DefaultWidgetProperty<HorizontalEventsMode> {
  constructor() {
    super({
      name: "mode",
      value: {
        mode: "period",
      },
      displayName: "События для отображения",
    });
  }

  public copy() {
    return new HorizontalEventsModeProperty();
  }

  markup(): ReactNode {
    return <HorizontalEventsModePropertyComponent property={this} />;
  }
}
