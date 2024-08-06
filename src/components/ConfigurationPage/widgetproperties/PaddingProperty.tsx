import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Col, Flex, InputNumber, Row, Segmented } from "antd";
import { produce } from "immer";
import { Trans } from "react-i18next";

export interface PaddingPropertyValue {
  isSame: boolean | null;
  bottom: number;
  top: number;
  left: number;
  right: number;
}

export const DEFAULT_PADDING_PROPERTY_VALUE = {
  isSame: true,
  bottom: 5,
  top: 5,
  left: 5,
  right: 5,
};

export class PaddingProperty extends DefaultWidgetProperty {
  constructor({
    widgetId,
    name,
    value,
    tab,
  }: {
    widgetId: string;
    name: string;
    value?: PaddingPropertyValue;
    tab?: string;
  }) {
    super(
      widgetId,
      name,
      "predefined",
      value ?? DEFAULT_PADDING_PROPERTY_VALUE,
      "",
      tab,
    );
  }

  copy(): PaddingProperty {
    return new PaddingProperty({
      widgetId: this.widgetId,
      name: this.name,
      value: this.value,
      tab: this.tab,
    });
  }

  comp = (updateConfig: Function) => {
    return (
      <Flex vertical={true} gap={10}>
        <LabeledContainer displayName={this.name}>
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
                label: "Общая",
              },
              {
                value: false,
                label: "Стороны",
              },
            ]}
            value={this.value.isSame}
            onChange={(checked) => {
              const updated = produce(
                this.value,
                (draft: PaddingPropertyValue) => {
                  draft.isSame = checked;
                },
              );
              updateConfig(this.widgetId, this.name, updated);
            }}
          />
        </LabeledContainer>
        {this.value.isSame === true && (
          <Row align="middle">
            <Col span={2} offset={8}>
              Отступ:
            </Col>
            <Col span={3}>
              <InputNumber
                value={this.value.top}
                addonAfter="px"
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: PaddingPropertyValue) => {
                      draft.top = value;
                      draft.right = value;
                      draft.left = value;
                      draft.bottom = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
          </Row>
        )}
        {this.value.isSame === false && (
          <Row align="middle">
            <Col span={2} offset={1}>
              <Trans i18nKey="paddingproperty-label-top" />
            </Col>
            <Col span={3}>
              <InputNumber
                value={this.value.top}
                addonAfter="px"
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: PaddingPropertyValue) => {
                      draft.top = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
            <Col span={2} offset={1}>
              <Trans i18nKey="paddingproperty-label-right" />
            </Col>
            <Col span={3}>
              <InputNumber
                value={this.value.right}
                addonAfter="px"
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: PaddingPropertyValue) => {
                      draft.right = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
            <Col span={2} offset={1}>
              <Trans i18nKey="paddingproperty-label-bottom" />
            </Col>
            <Col span={3}>
              <InputNumber
                value={this.value.bottom}
                addonAfter="px"
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: PaddingPropertyValue) => {
                      draft.bottom = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
            <Col span={2} offset={1}>
              <Trans i18nKey="paddingproperty-label-left" />
            </Col>
            <Col span={3}>
              <InputNumber
                value={this.value.left}
                addonAfter="px"
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: PaddingPropertyValue) => {
                      draft.left = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
          </Row>
        )}
      </Flex>
    );
  };

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame === true) {
      style.padding = `${this.value.top}px`;
    }
    if (this.value.isSame === false) {
      style.paddingTop = `${this.value.top}px`;
      style.paddingRight = `${this.value.right}px`;
      style.paddingLeft = `${this.value.left}px`;
      style.paddingBottom = `${this.value.bottom}px`;
    }
    return style;
  }

  markup(updateConfig: Function): ReactNode {
    return this.comp(updateConfig);
  }
}
