import { Select } from "antd";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { APPEARANCE_ANIMATIONS } from "../widgetsettings/alerts/PaymentAlertsWidgetSettingsComponent";
import { useTranslation } from "react-i18next";
import InputNumber from "../components/InputNumber";
import { toJS } from "mobx";
import { produce } from "immer";

export interface AnimationPropertyValue {
  animation: string;
  duration: number;
}

export class AnimationProperty extends DefaultWidgetProperty<AnimationPropertyValue> {
  constructor(params: {
    name: string;
    value?: AnimationPropertyValue;
    displayName?: string;
  }) {
    super({
      name: params.name,
      value: params.value ?? {
        animation: "none",
        duration: 2,
      },
      displayName: params.displayName ?? "appearance-animation",
    });
  }

  public markup() {
    const { t } = useTranslation();

    return (
      <>
        <LabeledContainer displayName={this.displayName}>
          <Select
            className="full-width"
            value={this.value.animation}
            options={[...APPEARANCE_ANIMATIONS, "random", "none"].map(
              (option) => {
                return { label: t(option), value: option };
              },
            )}
            onChange={(selected) => {
              this.value = produce(
                toJS(this.value),
                (draft: AnimationPropertyValue) => {
                  draft.animation = selected;
                },
              );
            }}
          />
        </LabeledContainer>
        <LabeledContainer displayName="animation-duration">
          <InputNumber
            value={this.value.duration}
            onChange={(value) => {
              this.value = produce(
                toJS(this.value),
                (draft: AnimationPropertyValue) => {
                  draft.duration = value;
                },
              );
            }}
            addon="sec"
          />
        </LabeledContainer>
      </>
    );
  }
}
