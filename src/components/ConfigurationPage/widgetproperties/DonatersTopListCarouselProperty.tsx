import { ReactNode, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import BooleanPropertyInput from "../settings/properties/BooleanPropertyInput";
import { InputNumber } from "antd";
import { produce } from "immer";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

interface DonatersTopListCarouselPropertyValue {
  enabled: boolean;
  amount: number;
  delay: number;
  speed: number;
}

const DonatersTopListCarouselPropertyComponent = observer(
  ({ property }: { property: DonatersTopListCarouselProperty }) => {
    return (
      <>
        <LabeledContainer displayName="widget-donaterslist-list-enable-carousel">
          <BooleanPropertyInput
            prop={{ value: property.value.enabled }}
            onChange={(enabled: boolean) => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.enabled = enabled;
              });
            }}
          />
        </LabeledContainer>
        {property.value.enabled && (
          <>
            <LabeledContainer displayName="widget-donaterslist-list-carousel-item-amount">
              <InputNumber
                value={property.value.amount}
                onChange={(amount) => {
                  if (!amount) {
                    return;
                  }
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.amount = amount;
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-donaterslist-carousel-delay">
              <InputNumber
                value={property.value.delay}
                onChange={(delay) => {
                  if (!delay) {
                    return;
                  }
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.delay = delay;
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-donaterslist-carousel-animation-speed">
              <InputNumber
                value={property.value.speed}
                onChange={(speed) => {
                  if (!speed) {
                    return;
                  }
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.speed = speed;
                  });
                }}
              />
            </LabeledContainer>
          </>
        )}
      </>
    );
  },
);

export class DonatersTopListCarouselProperty extends DefaultWidgetProperty<DonatersTopListCarouselPropertyValue> {
  constructor() {
    super({
      name: "carousel",
      value: { enabled: false, amount: 1, delay: 3, speed: 0.5 },
      displayName: "Карусель",
    });
  }

  markup(): ReactNode {
    return <DonatersTopListCarouselPropertyComponent property={this} />;
  }
}
