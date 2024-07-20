import { ReactNode, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import BooleanPropertyInput from "../settings/properties/BooleanPropertyInput";
import { InputNumber } from "antd";
import { produce } from "immer";

export class DonatersTopListCarouselProperty extends DefaultWidgetProperty {
  constructor(widgetId: string, value?: any) {
    super(
      widgetId,
      "carousel",
      "predefined",
      value ?? { enabled: false, amount: 1 },
      "",
      "layout",
    );
  }

  copy(): DonatersTopListCarouselProperty {
    return new DonatersTopListCarouselProperty(this.widgetId, this.value);
  }

  comp = (updateConfig: Function) => {
    return (
      <>
        <LabeledContainer displayName="widget-donaterslist-list-enable-carousel">
          <BooleanPropertyInput
            prop={{ value: this.value.enabled }}
            onChange={(e) => {
              if (!this.widgetId) {
                return;
              }
              updateConfig(
                this.widgetId,
                this.name,
                produce(this.value, (draft) => {
                  draft.enabled = e;
                }),
              );
            }}
          />
        </LabeledContainer>
        {this.value.enabled && (<LabeledContainer displayName="widget-donaterslist-list-carousel-item-amount">
          <InputNumber
            value={this.value.amount}
            onChange={(e) => {
              if (!this.widgetId) {
                return;
              }
              updateConfig(
                this.widgetId,
                this.name,
                produce(this.value, (draft) => {
                  draft.amount = e;
                }),
              );
            }}
          />
        </LabeledContainer>)}
      </>
    );
  };

  markup(updateConfig: Function): ReactNode {
    return this.comp(updateConfig);
  }
}
