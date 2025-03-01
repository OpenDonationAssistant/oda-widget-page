import { Select } from "antd";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { DefaultWidgetProperty } from "./WidgetProperty";
import {
  APPEARANCE_ANIMATIONS,
  IDLE_ANIMATIONS,
  OUT_ANIMATIONS,
} from "../widgetsettings/alerts/PaymentAlertsWidgetSettingsComponent";
import { useTranslation } from "react-i18next";
import InputNumber from "../components/InputNumber";
import { toJS } from "mobx";
import { produce } from "immer";
import { getRndInteger } from "../../../utils";

export interface AnimationPropertyValue {
  animation: string;
  duration: number;
}

export class AnimationProperty extends DefaultWidgetProperty<AnimationPropertyValue> {
  private _options: string[] = [];
  private _target: "in" | "out" | "idle";

  constructor(params: {
    name: string;
    value?: AnimationPropertyValue;
    displayName?: string;
    target: "in" | "out" | "idle";
  }) {
    super({
      name: params.name,
      value: params.value ?? {
        animation: "none",
        duration: 2,
      },
      displayName: params.displayName ?? "appearance-animation",
    });
    this._target = params.target;
    if (params.target === "in") {
      this._options = [...APPEARANCE_ANIMATIONS, "random", "none"];
    }
    if (params.target === "idle") {
      this._options = [...IDLE_ANIMATIONS, "random", "none"];
    }
    if (params.target === "out") {
      this._options = [...OUT_ANIMATIONS, "random", "none"];
    }
  }

  public markup() {
    const { t } = useTranslation();

    return (
      <>
        <LabeledContainer displayName={this.displayName}>
          <Select
            className="full-width"
            value={this.value.animation}
            options={this._options.map((option) => {
              return { label: t(option), value: option };
            })}
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

  public classname(): string {
    if (this.value.animation === "random") {
      const choice =
        APPEARANCE_ANIMATIONS[
          getRndInteger(0, APPEARANCE_ANIMATIONS.length - 1)
        ];
      return `animate__animated animate__slow animate__${choice}`;
    }

    return `animate__animated animate__slow animate__${this.value.animation} ${this._target === "idle" ? "animate__infinite" : ""}`;
  }
}
