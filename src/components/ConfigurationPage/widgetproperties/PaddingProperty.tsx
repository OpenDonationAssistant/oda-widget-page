import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Flex, Segmented } from "antd";
import { produce } from "immer";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import InputNumber from "../components/InputNumber";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";

export interface PaddingPropertyValue {
  isSame: boolean | null;
  bottom: number;
  top: number;
  left: number;
  right: number;
}

export const DEFAULT_PADDING_PROPERTY_VALUE: PaddingPropertyValue = {
  isSame: null,
  bottom: 0,
  top: 0,
  left: 0,
  right: 0,
};

export const PaddingPropertyComponent = observer(
  ({
    value,
    displayName,
  }: {
    value: PaddingPropertyValue;
    displayName: string;
  }) => {
    return (
      <Flex vertical={true} gap={12}>
        <LabeledContainer displayName={displayName}>
          <Segmented
            block
            className="full-width"
            options={[
              {
                value: null,
                label: "Отсутствует",
              },
              {
                value: true,
                label: "Общий",
              },
              {
                value: false,
                label: "По сторонам",
              },
            ]}
            value={value.isSame}
            onChange={(checked) => {
              value.isSame = checked;
            }}
          />
        </LabeledContainer>
        {value.isSame === true && (
          <InputNumber
            value={value.top}
            addon="px"
            onChange={(updated) => {
              if (updated === null || updated === undefined) {
                return;
              }
              value.top = updated;
              value.right = updated;
              value.left = updated;
              value.bottom = updated;
            }}
          />
        )}
        {value.isSame === false && (
          <Flex vertical className="full-width">
            <Flex gap={9} className="full-width">
              <SmallLabeledContainer displayName="paddingproperty-label-top">
                <InputNumber
                  value={value.top}
                  addon="px"
                  onChange={(updated) => {
                    if (updated === null || updated === undefined) {
                      return;
                    }
                    value.top = updated;
                  }}
                />
              </SmallLabeledContainer>
              <SmallLabeledContainer displayName="paddingproperty-label-right">
                <InputNumber
                  value={value.right}
                  addon="px"
                  onChange={(updated) => {
                    if (updated === null || updated === undefined) {
                      return;
                    }
                    value.right = updated;
                  }}
                />
              </SmallLabeledContainer>
            </Flex>
            <Flex gap={9} className="full-width">
              <SmallLabeledContainer displayName="paddingproperty-label-bottom">
                <InputNumber
                  value={value.bottom}
                  addon="px"
                  onChange={(updated) => {
                    if (updated === null || updated === undefined) {
                      return;
                    }
                    value.bottom = updated;
                  }}
                />
              </SmallLabeledContainer>
              <SmallLabeledContainer displayName="paddingproperty-label-left">
                <InputNumber
                  value={value.left}
                  addon="px"
                  onChange={(updated) => {
                    if (updated === null || updated === undefined) {
                      return;
                    }
                    value.left = updated;
                  }}
                />
              </SmallLabeledContainer>
            </Flex>
          </Flex>
        )}
      </Flex>
    );
  },
);

export class PaddingProperty extends DefaultWidgetProperty<PaddingPropertyValue> {
  private _target: "padding" | "margin";

  constructor({
    name,
    value,
    displayName,
    target,
  }: {
    name: string;
    value?: PaddingPropertyValue;
    displayName?: string;
    target?: "padding" | "margin";
  }) {
    super({
      name: name,
      value: value ?? DEFAULT_PADDING_PROPERTY_VALUE,
      displayName: displayName ?? "padding",
    });
    this._target = target ?? "padding";
  }

  copy() {
    return new PaddingProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      displayName: this.displayName,
      target: this._target,
    });
  }

  calcCss(): CSSProperties {
    if (this._target === "padding") {
      return this.calcPadding();
    } else {
      return this.calcMargin();
    }
  }

  calcPadding(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame === true) {
      style.paddingTop = `${this.value.top}px`;
      style.paddingRight = `${this.value.top}px`;
      style.paddingLeft = `${this.value.top}px`;
      style.paddingBottom = `${this.value.top}px`;
    }
    if (this.value.isSame === false) {
      style.paddingTop = `${this.value.top}px`;
      style.paddingRight = `${this.value.right}px`;
      style.paddingLeft = `${this.value.left}px`;
      style.paddingBottom = `${this.value.bottom}px`;
    }
    return style;
  }

  calcMargin(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame === true) {
      style.marginTop = `${this.value.top}px`;
      style.marginRight = `${this.value.top}px`;
      style.marginLeft = `${this.value.top}px`;
      style.marginBottom = `${this.value.top}px`;
    }
    if (this.value.isSame === false) {
      style.marginTop = `${this.value.top}px`;
      style.marginRight = `${this.value.right}px`;
      style.marginLeft = `${this.value.left}px`;
      style.marginBottom = `${this.value.bottom}px`;
    }
    return style;
  }

  markup(): ReactNode {
    return (
      <PaddingPropertyComponent
        value={this.value}
        displayName={this.displayName}
      />
    );
  }
}
