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
import { log } from "../../../logging";
import { observer } from "mobx-react-lite";
import { CSSProperties } from "react";

export interface AnimationPropertyValue {
  animation: string;
  duration: number;
}

export const Component = observer(
  ({ property }: { property: AnimationProperty }) => {
    const { t } = useTranslation();

    return (
      <>
        <LabeledContainer displayName={property.displayName}>
          <Select
            className="full-width"
            value={property.value.animation}
            options={property.options.map((option) => {
              return { label: t(option), value: option };
            })}
            onChange={(selected) => {
              property.value = produce(
                toJS(property.value),
                (draft: AnimationPropertyValue) => {
                  draft.animation = selected;
                  if (selected === "none") {
                    draft.duration = 0;
                  }
                },
              );
            }}
          />
        </LabeledContainer>
        {property.target !== "idle" && property.value.animation !== "none" && (
          <LabeledContainer displayName="animation-duration">
            <InputNumber
              value={property.value.duration}
              increment={100}
              onChange={(value) => {
                property.value = produce(
                  toJS(property.value),
                  (draft: AnimationPropertyValue) => {
                    draft.duration = value;
                  },
                );
              }}
              addon="ms"
            />
          </LabeledContainer>
        )}
      </>
    );
  },
);

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
        duration: 0,
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
    return <Component property={this} />;
  }

  public get options(): string[] {
    return this._options;
  }

  public get target(): "in" | "out" | "idle" {
    return this._target;
  }

  public classname(): string {
    if (this.value.animation === "random") {
      const choice =
        APPEARANCE_ANIMATIONS[
          getRndInteger(0, APPEARANCE_ANIMATIONS.length - 1)
        ];
      return `animate__animated animate__slow animate__${choice}`;
    }

    log.debug({ animation: this.value.animation }, "create animation");

    return `animate__animated animate__${this.value.animation} ${this._target === "idle" ? "animate__infinite" : ""}`;
  }

  public calcCss(): CSSProperties{
    return {
      "--animate-duration": `${this.value.duration / 1000}s`
    };
  }
}
