import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { produce } from "immer";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import BooleanPropertyInput from "../components/BooleanPropertyInput";
import InputNumber from "../components/InputNumber";

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
                  if (amount === undefined || amount === null) {
                    return;
                  }
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.amount = amount;
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-donaterslist-carousel-animation-speed">
              <InputNumber
                value={property.value.speed}
                increment={0.1}
                onChange={(speed) => {
                  if (speed === undefined || speed === null) {
                    return;
                  }
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.speed = Math.round(speed * 10) / 10;
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-donaterslist-carousel-delay">
              <InputNumber
                value={property.value.delay}
                addon="sec" // TODO: localize
                onChange={(delay) => {
                  if (delay === undefined || delay === null) {
                    return;
                  }
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.delay = delay;
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
