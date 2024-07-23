import { ReactNode } from "react";
import { Trans } from "react-i18next";
import { DefaultWidgetProperty } from "./WidgetProperty";
import ModalButton from "../../ModalButton/ModalButton";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorPicker, Select } from "antd";
import { produce } from "immer";

interface BackgroundPropertyValue {
  gradient: string;
  colors: string[];
  angle: number;
  animated: boolean;
  steps: AnimationStep[];
}

interface AnimationStep {
  step: number;
  x: number;
  y: number;
}

const DEFAULT_BACKGROUND_PROPERTY_VALUE: BackgroundPropertyValue = {
  gradient: "none",
  colors: ["#FFFFFF"],
  angle: 0,
  animated: false,
  steps: [],
};

const GRADIENT_TYPES = ["none", "linear", "radial"];

export class BackgroundProperty extends DefaultWidgetProperty {
  constructor({
    widgetId,
    name,
    displayName,
    value,
    tab,
  }: {
    widgetId: string;
    name: string;
    displayName: string;
    value?: BackgroundPropertyValue;
    tab?: string;
  }) {
    super(
      widgetId,
      name,
      "predefined",
      value ?? DEFAULT_BACKGROUND_PROPERTY_VALUE,
      displayName,
      tab,
    );
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <ModalButton
        modalTitle={this.displayName}
        buttonLabel="button-settings"
        label={this.displayName}
      >
        <LabeledContainer displayName="label-gradient-type">
          <Select
            value={this.value.gradient}
            className="full-width"
            onChange={(e) => {
              if (!this.widgetId) {
                return;
              }
              const updated = produce(
                this.value,
                (draft: BackgroundPropertyValue) => {
                  draft.gradient = e;
                },
              );
              updateConfig(this.widgetId, this.name, updated);
            }}
            options={GRADIENT_TYPES.map((option) => {
              return {
                value: option,
                label: (
                  <>
                    <Trans i18nKey={option} />
                  </>
                ),
              };
            })}
          />
        </LabeledContainer>
        {this.value.gradient === "none" && (
          <LabeledContainer displayName="label-color">
            <ColorPicker
              showText
              value={this.value.colors.at(0) ?? "#FFFFFF"}
              onChange={(color) => {
                const updated = produce(
                  this.value,
                  (draft: BackgroundPropertyValue) => {
                    draft.colors[0] = color.toRgbString();
                  },
                );
                updateConfig(this.widgetId, this.name, updated);
              }}
            />
          </LabeledContainer>
        )}
      </ModalButton>
    );
  }

  copy() {
    return new BackgroundProperty({
      widgetId: this.widgetId,
      name: this.name,
      displayName: this.displayName,
      value: this.value,
      tab: this.tab,
    });
  }
}
