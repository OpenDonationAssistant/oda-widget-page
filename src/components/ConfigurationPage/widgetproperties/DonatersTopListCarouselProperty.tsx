import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { produce } from "immer";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import BooleanPropertyInput from "../components/BooleanPropertyInput";
import InputNumber from "../components/InputNumber";
import { LightLabeledSwitchComponent } from "../../LabeledSwitch/LabeledSwitchComponent";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import {
  APPEARANCE_ANIMATIONS,
  OUT_ANIMATIONS,
} from "../widgetsettings/alerts/PaymentAlertsWidgetSettingsComponent";

interface DonatersTopListCarouselPropertyValue {
  enabled: boolean;
  amount: number;
  delay: number;
  speed: number;
  inAnimation?: string;
  outAnimation?: string;
}

const DonatersTopListCarouselPropertyComponent = observer(
  ({ property }: { property: DonatersTopListCarouselProperty }) => {
    const { t } = useTranslation();

    return (
      <>
        <LightLabeledSwitchComponent
          value={property.value.enabled}
          onChange={(enabled: boolean) => {
            property.value = produce(toJS(property.value), (draft) => {
              draft.enabled = enabled;
            });
          }}
          label="widget-donaterslist-list-enable-carousel"
        />
        {property.value.enabled && (
          <>
            <div
              style={{
                marginTop: "12px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "9px",
              }}
            >
              <SmallLabeledContainer displayName="widget-donaterslist-list-carousel-item-amount">
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
              </SmallLabeledContainer>
              <SmallLabeledContainer displayName="widget-donaterslist-carousel-delay">
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
              </SmallLabeledContainer>
            </div>
            <div
              style={{
                marginTop: "12px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "9px",
              }}
            >
              <SmallLabeledContainer displayName="Анимация появления">
                <Select
                  style={{ flexGrow: 1 }}
                  value={property.value.inAnimation}
                  options={APPEARANCE_ANIMATIONS.map((animation) => ({
                    value: animation,
                    label: t(animation),
                  }))}
                  onChange={(animation) => {
                    property.value = produce(toJS(property.value), (draft) => {
                      draft.inAnimation = animation;
                    });
                  }}
                />
              </SmallLabeledContainer>
              <SmallLabeledContainer displayName="Анимация скрытия">
                <Select
                  style={{ flexGrow: 1 }}
                  value={property.value.outAnimation}
                  options={OUT_ANIMATIONS.map((animation) => ({
                    value: animation,
                    label: t(animation),
                  }))}
                  onChange={(animation) => {
                    property.value = produce(toJS(property.value), (draft) => {
                      draft.outAnimation = animation;
                    });
                  }}
                />
              </SmallLabeledContainer>
            </div>
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
      value: {
        enabled: false,
        amount: 1,
        delay: 3,
        speed: 0.5,
        inAnimation: "none",
        outAnimation: "none",
      },
      displayName: "Карусель",
    });
  }

  copy() {
    const newCopy = new DonatersTopListCarouselProperty();
    newCopy.value = produce(toJS(this.value), (draft) => draft);
    return newCopy;
  }

  markup(): ReactNode {
    return <DonatersTopListCarouselPropertyComponent property={this} />;
  }
}
