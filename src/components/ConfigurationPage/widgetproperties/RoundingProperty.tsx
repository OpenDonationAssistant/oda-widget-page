import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Col, Flex, Row, Segmented } from "antd";
import { produce } from "immer";
import classes from "./RoundingProperty.module.css";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import InputNumber from "../components/InputNumber";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";

export interface RoundingValue {
  isSame: boolean | null;
  bottomLeft: number;
  bottomRight: number;
  topLeft: number;
  topRight: number;
}

export const DEFAULT_ROUNDING_PROPERTY_VALUE: RoundingValue = {
  isSame: null,
  bottomLeft: 0,
  bottomRight: 0,
  topLeft: 0,
  topRight: 0,
};

export const RoundingPropertyComponent = observer(
  ({
    value,
    displayName,
    help,
  }: {
    value: RoundingValue;
    displayName: string;
    help?: string;
  }) => {
    const { t } = useTranslation();
    return (
      <Flex vertical={true} gap={10}>
        <LabeledContainer displayName={displayName} help={help}>
          <Segmented
            block
            className="full-width"
            value={value.isSame}
            options={[
              { label: t("label-rounding-absent"), value: null },
              { label: t("label-rounding-same"), value: true },
              { label: t("label-rounding-different"), value: false },
            ]}
            onChange={(selected) => {
              value.isSame = selected;
              if (value.isSame) {
                value.topRight = value.topLeft;
                value.bottomRight = value.topLeft;
                value.bottomLeft = value.topLeft;
              }
              if (value.isSame === null) {
                value.topLeft = 0;
                value.topRight = 0;
                value.bottomRight = 0;
                value.bottomLeft = 0;
              }
            }}
          />
        </LabeledContainer>
        {value.isSame === true && (
          <InputNumber
            value={value.topLeft}
            addon="px"
            onChange={(newValue) => {
              if (newValue === undefined || newValue === null) {
                return;
              }
              value.topLeft = newValue;
              value.topRight = newValue;
              value.bottomLeft = newValue;
              value.bottomRight = newValue;
            }}
          />
        )}
        {value.isSame === false && (
          <Flex
            gap={10}
            vertical={true}
            className={`${classes.roundingvalues}`}
          >
            <Flex className="full-width" gap={9}>
              <SmallLabeledContainer displayName={"TopLeft"}>
                <InputNumber
                  addon="px"
                  value={value.topLeft}
                  onChange={(newValue) => {
                    if (newValue === undefined || newValue === null) {
                      return;
                    }
                    value.topLeft = newValue;
                  }}
                />
              </SmallLabeledContainer>
              <SmallLabeledContainer displayName={"TopRight"}>
                <InputNumber
                  addon="px"
                  value={value.topRight}
                  onChange={(newValue) => {
                    if (newValue === undefined || newValue === null) {
                      return;
                    }
                    value.topRight = newValue;
                  }}
                />
              </SmallLabeledContainer>
            </Flex>
            <Flex className="full-width" gap={9}>
              <SmallLabeledContainer displayName={"BottomLeft"}>
                <InputNumber
                  addon="px"
                  value={value.bottomLeft}
                  onChange={(newValue) => {
                    if (newValue === undefined || newValue === null) {
                      return;
                    }
                    value.bottomLeft = newValue;
                  }}
                />
              </SmallLabeledContainer>
              <SmallLabeledContainer displayName={"BottomRight"}>
                <InputNumber
                  addon="px"
                  value={value.bottomRight}
                  onChange={(newValue) => {
                    if (newValue === undefined || newValue === null) {
                      return;
                    }
                    value.bottomRight = newValue;
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

export class RoundingProperty extends DefaultWidgetProperty<RoundingValue> {
  constructor({
    name,
    displayName,
    value,
    help,
  }: {
    name: string;
    displayName?: string;
    value?: RoundingValue;
    help?: string;
  }) {
    super({
      name: name,
      value: value ?? DEFAULT_ROUNDING_PROPERTY_VALUE,
      displayName: displayName ?? "rounding",
      help: help,
    });
  }

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame) {
      style.borderTopRightRadius = this.value.topLeft + "px";
      style.borderBottomRightRadius = this.value.topLeft + "px";
      style.borderBottomLeftRadius = this.value.topLeft + "px";
      style.borderTopLeftRadius = this.value.topLeft + "px";
    } else {
      style.borderTopRightRadius = this.value.topRight + "px";
      style.borderBottomRightRadius = this.value.bottomRight + "px";
      style.borderBottomLeftRadius = this.value.bottomLeft + "px";
      style.borderTopLeftRadius = this.value.topLeft + "px";
    }
    return style;
  }

  markup(): ReactNode {
    return (
      <RoundingPropertyComponent
        value={this.value}
        displayName={this.displayName}
        help={this.help ?? ""}
      />
    );
  }

  public copy() {
    return new RoundingProperty({
      name: this.name,
      displayName: this.displayName,
      value: produce(toJS(this.value), (draft) => draft),
      help: this.help,
    });
  }
}
