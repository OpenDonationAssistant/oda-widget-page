import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import { LightLabeledSwitchComponent } from "../../../LabeledSwitch/LabeledSwitchComponent";
import InputNumber from "../../components/InputNumber";
import { useTranslation } from "react-i18next";

export interface MaxLenValue {
  limitLen: boolean;
  limit: number;
}

const MaxLenComponent = observer(({ property }: { property: MaxLen }) => {
  const { t } = useTranslation();
  return (
    <>
      <LightLabeledSwitchComponent
        label="media-max-length"
        value={property.value.limitLen}
        onChange={(update) => {
          property.value.limitLen = update;
        }}
      />
      {property.value.limitLen && (
        <InputNumber
          value={property.value.limit}
          addon={t("media-unit-seconds")}
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
      displayName: "media-max-length",
    });
  }

  markup(): ReactNode {
    return <MaxLenComponent property={this} />;
  }
}
