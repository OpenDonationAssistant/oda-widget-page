import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Col, Flex, InputNumber, Row, Segmented } from "antd";
import { produce } from "immer";
import classes from "./RoundingProperty.module.css";
import { useTranslation } from "react-i18next";

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

export class RoundingProperty extends DefaultWidgetProperty {
  constructor({
    widgetId,
    name,
    displayName,
    value,
    tab,
  }: {
    widgetId: string;
    name: string;
    displayName?: string;
    value?: RoundingValue;
    tab?: string;
  }) {
    super(
      widgetId,
      name,
      "predefined",
      value ?? DEFAULT_ROUNDING_PROPERTY_VALUE,
      displayName ?? "rounding",
      tab,
    );
  }

  copy(): RoundingProperty {
    return new RoundingProperty({
      widgetId: this.widgetId,
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      tab: this.tab,
    });
  }

  comp = (updateConfig: Function) => {
    const { t } = useTranslation();
    return (
      <Flex vertical={true} gap={10}>
        <LabeledContainer displayName={this.displayName}>
          <Segmented
            block
            className="full-width"
            value={this.value.isSame}
            options={[
              { label: t("label-rounding-absent"), value: null },
              { label: t("label-rounding-same"), value: true },
              { label: t("label-rounding-different"), value: false },
            ]}
            onChange={(selected) => {
              const updated = produce(this.value, (draft: RoundingValue) => {
                draft.isSame = selected;
              });
              updateConfig(this.widgetId, this.name, updated);
            }}
          />
        </LabeledContainer>
        {this.value.isSame === true && (
          <Row align="middle">
            <Col span={2} offset={16}>
              <span>Радиус:</span>
            </Col>
            <Col span={4}>
              <InputNumber
                value={this.value.topLeft}
                addonAfter="px"
                onChange={(newValue) => {
                  const updated = produce(
                    this.value,
                    (draft: RoundingValue) => {
                      draft.topLeft = newValue;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
          </Row>
        )}
        {this.value.isSame === false && (
          <Flex
            gap={10}
            vertical={true}
            className={`${classes.roundingvalues}`}
          >
            <Row>
              <Col span={3} offset={5}>
                <span>TopLeft</span>
              </Col>
              <Col span={2}>
                <InputNumber
                  addonAfter="px"
                  value={this.value.topLeft}
                  onChange={(newValue) => {
                    const updated = produce(
                      this.value,
                      (draft: RoundingValue) => {
                        draft.topLeft = newValue;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
              <Col span={3} offset={4}>
                <span>TopRight</span>
              </Col>
              <Col span={2}>
                <InputNumber
                  addonAfter="px"
                  value={this.value.topRight}
                  onChange={(newValue) => {
                    const updated = produce(
                      this.value,
                      (draft: RoundingValue) => {
                        draft.topRight = newValue;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={3} offset={5}>
                <span>BottomLeft</span>
              </Col>
              <Col span={2}>
                <InputNumber
                  addonAfter="px"
                  value={this.value.bottomLeft}
                  onChange={(newValue) => {
                    const updated = produce(
                      this.value,
                      (draft: RoundingValue) => {
                        draft.bottomLeft = newValue;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
              <Col span={3} offset={4}>
                <span>BottomRight</span>
              </Col>
              <Col span={2}>
                <InputNumber
                  addonAfter="px"
                  value={this.value.bottomRight}
                  onChange={(newValue) => {
                    const updated = produce(
                      this.value,
                      (draft: RoundingValue) => {
                        draft.bottomRight = newValue;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
            </Row>
          </Flex>
        )}
      </Flex>
    );
  };

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame) {
      style.borderRadius = this.value.topLeft;
    } else {
      style.borderTopRightRadius = this.value.topRight;
      style.borderBottomRightRadius = this.value.bottomRight;
      style.borderBottomLeftRadius = this.value.bottomLeft;
      style.borderTopLeftRadius = this.value.topLeft;
    }
    return style;
  }

  markup(updateConfig: Function): ReactNode {
    return this.comp(updateConfig);
  }
}
