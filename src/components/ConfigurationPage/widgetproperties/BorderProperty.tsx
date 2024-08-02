import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import {
  Col,
  ColorPicker,
  Flex,
  InputNumber,
  Row,
  Segmented,
  Select,
  Switch,
} from "antd";
import { produce } from "immer";
import ModalButton from "../../ModalButton/ModalButton";
import classes from "./BorderProperty.module.css";
import { Trans } from "react-i18next";

export interface Border {
  width: number;
  color: string;
  type: string;
}

export interface BorderPropertyValue {
  isSame: boolean | null;
  bottom: Border;
  top: Border;
  left: Border;
  right: Border;
}

const DEFAULT_BORDER_VALUE = {
  width: 0,
  color: "#FFFFFF",
  type: "solid",
};

export const DEFAULT_BORDER_PROPERTY_VALUE: BorderPropertyValue = {
  isSame: true,
  bottom: DEFAULT_BORDER_VALUE,
  top: DEFAULT_BORDER_VALUE,
  left: DEFAULT_BORDER_VALUE,
  right: DEFAULT_BORDER_VALUE,
};

export class BorderProperty extends DefaultWidgetProperty {
  constructor({
    widgetId,
    name,
    value,
    tab,
  }: {
    widgetId: string;
    name: string;
    value?: BorderPropertyValue;
    tab?: string;
  }) {
    super(
      widgetId,
      name,
      "predefined",
      value ?? DEFAULT_BORDER_PROPERTY_VALUE,
      "",
      tab,
    );
  }

  copy(): BorderProperty {
    return new BorderProperty({
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
                (draft: BorderPropertyValue) => {
                  draft.isSame = checked;
                },
              );
              updateConfig(this.widgetId, this.name, updated);
            }}
          />
        </LabeledContainer>
        {this.value.isSame === true && (
          <Row align="middle">
            <Col span={2} offset={5}>
              Тип
            </Col>
            <Col span={2}>
              <Select
                className="full-width"
                value={this.value.top.type}
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: BorderPropertyValue) => {
                      draft.top.type = value;
                      draft.right.type = value;
                      draft.bottom.type = value;
                      draft.left.type = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
                options={[
                  {
                    value: "solid",
                    label: "solid",
                  },
                  {
                    value: "dotted",
                    label: "dotted",
                  },
                  {
                    value: "dashed",
                    label: "dashed",
                  },
                  {
                    value: "double",
                    label: "double",
                  },
                  {
                    value: "groove",
                    label: "groove",
                  },
                  {
                    value: "ridge",
                    label: "ridge",
                  },
                  {
                    value: "inset",
                    label: "inset",
                  },
                  {
                    value: "outset",
                    label: "outset",
                  },
                ]}
              />
            </Col>
            <Col span={1} offset={1}>
              Цвет
            </Col>
            <Col span={3}>
              <ColorPicker
                showText
                value={this.value.top.color}
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: BorderPropertyValue) => {
                      draft.top.color = value.toRgbString();
                      draft.right.color = value.toRgbString();
                      draft.bottom.color = value.toRgbString();
                      draft.left.color = value.toRgbString();
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
            <Col span={2} offset={1}>
              Ширина:
            </Col>
            <Col span={3}>
              <InputNumber
                value={this.value.top.width}
                addonAfter="px"
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: BorderPropertyValue) => {
                      draft.top.width = value;
                      draft.right.width = value;
                      draft.left.width = value;
                      draft.bottom.width = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
          </Row>
        )}
        {this.value.isSame === false && (
          <Flex vertical={true} gap={5}>
            <Row align="middle">
              <Col span={4} offset={2}>
                <Trans i18nKey="borderproperty-label-top" />
              </Col>
              <Col span={1} offset={1}>
                Тип
              </Col>
              <Col span={3}>
                <Select
                  className="full-width"
                  value={this.value.top.type}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.top.type = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                  options={[
                    {
                      value: "solid",
                      label: "solid",
                    },
                    {
                      value: "dotted",
                      label: "dotted",
                    },
                    {
                      value: "dashed",
                      label: "dashed",
                    },
                    {
                      value: "double",
                      label: "double",
                    },
                    {
                      value: "groove",
                      label: "groove",
                    },
                    {
                      value: "ridge",
                      label: "ridge",
                    },
                    {
                      value: "inset",
                      label: "inset",
                    },
                    {
                      value: "outset",
                      label: "outset",
                    },
                  ]}
                />
              </Col>
              <Col span={1} offset={1}>
                Цвет
              </Col>
              <Col span={3}>
                <ColorPicker
                  showText
                  value={this.value.top.color}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.top.color = value.toRgbString();
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
              <Col span={2} offset={1}>
                Ширина:
              </Col>
              <Col span={3}>
                <InputNumber
                  value={this.value.top.width}
                  addonAfter="px"
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.top.width = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={4} offset={2}>
                <Trans i18nKey="borderproperty-label-right" />
              </Col>
              <Col span={1} offset={1}>
                Тип
              </Col>
              <Col span={3}>
                <Select
                  className="full-width"
                  value={this.value.right.type}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.right.type = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                  options={[
                    {
                      value: "solid",
                      label: "solid",
                    },
                    {
                      value: "dotted",
                      label: "dotted",
                    },
                    {
                      value: "dashed",
                      label: "dashed",
                    },
                    {
                      value: "double",
                      label: "double",
                    },
                    {
                      value: "groove",
                      label: "groove",
                    },
                    {
                      value: "ridge",
                      label: "ridge",
                    },
                    {
                      value: "inset",
                      label: "inset",
                    },
                    {
                      value: "outset",
                      label: "outset",
                    },
                  ]}
                />
              </Col>
              <Col span={1} offset={1}>
                Цвет
              </Col>
              <Col span={3}>
                <ColorPicker
                  showText
                  value={this.value.right.color}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.right.color = value.toRgbString();
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
              <Col span={2} offset={1}>
                Ширина:
              </Col>
              <Col span={3}>
                <InputNumber
                  value={this.value.right.width}
                  addonAfter="px"
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.right.width = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={4} offset={2}>
                <Trans i18nKey="borderproperty-label-bottom" />
              </Col>
              <Col span={1} offset={1}>
                Тип
              </Col>
              <Col span={3}>
                <Select
                  className="full-width"
                  value={this.value.bottom.type}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.bottom.type = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                  options={[
                    {
                      value: "solid",
                      label: "solid",
                    },
                    {
                      value: "dotted",
                      label: "dotted",
                    },
                    {
                      value: "dashed",
                      label: "dashed",
                    },
                    {
                      value: "double",
                      label: "double",
                    },
                    {
                      value: "groove",
                      label: "groove",
                    },
                    {
                      value: "ridge",
                      label: "ridge",
                    },
                    {
                      value: "inset",
                      label: "inset",
                    },
                    {
                      value: "outset",
                      label: "outset",
                    },
                  ]}
                />
              </Col>
              <Col span={1} offset={1}>
                Цвет
              </Col>
              <Col span={3}>
                <ColorPicker
                  showText
                  value={this.value.bottom.color}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.bottom.color = value.toRgbString();
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
              <Col span={2} offset={1}>
                Ширина:
              </Col>
              <Col span={3}>
                <InputNumber
                  value={this.value.bottom.width}
                  addonAfter="px"
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.bottom.width = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={4} offset={2}>
                <Trans i18nKey="borderproperty-label-left" />
              </Col>
              <Col span={1} offset={1}>
                Тип
              </Col>
              <Col span={3}>
                <Select
                  className="full-width"
                  value={this.value.left.type}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.left.type = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                  options={[
                    {
                      value: "solid",
                      label: "solid",
                    },
                    {
                      value: "dotted",
                      label: "dotted",
                    },
                    {
                      value: "dashed",
                      label: "dashed",
                    },
                    {
                      value: "double",
                      label: "double",
                    },
                    {
                      value: "groove",
                      label: "groove",
                    },
                    {
                      value: "ridge",
                      label: "ridge",
                    },
                    {
                      value: "inset",
                      label: "inset",
                    },
                    {
                      value: "outset",
                      label: "outset",
                    },
                  ]}
                />
              </Col>
              <Col span={1} offset={1}>
                Цвет
              </Col>
              <Col span={3}>
                <ColorPicker
                  showText
                  value={this.value.left.color}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.left.color = value.toRgbString();
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
              <Col span={2} offset={1}>
                Ширина:
              </Col>
              <Col span={3}>
                <InputNumber
                  value={this.value.left.width}
                  addonAfter="px"
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: BorderPropertyValue) => {
                        draft.left.width = value;
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
    if (this.value.isSame === false) {
      style.border = this.createRule(this.value.top);
    } else {
      style.borderTop = this.createRule(this.value.top);
      style.borderRight = this.createRule(this.value.right);
      style.borderLeft = this.createRule(this.value.left);
      style.borderBottom = this.createRule(this.value.bottom);
    }
    return style;
  }

  private createRule(border: Border) {
    return `${border.width}px ${border.type} ${border.color}`;
  }

  markup(updateConfig: Function): ReactNode {
    return this.comp(updateConfig);
  }
}
