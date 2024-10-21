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
} from "antd";
import { Trans } from "react-i18next";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { produce } from "immer";

export interface Border {
  width: number;
  type: string;
  color: string;
}

export const DEFAULT_BORDER = {
  width: 1,
  type: "solid",
  color: "#000000",
};

export interface BorderPropertyValue {
  isSame: boolean | null;
  bottom: Border;
  top: Border;
  left: Border;
  right: Border;
}

export const DEFAULT_BORDER_PROPERTY_VALUE = {
  isSame: null,
  bottom: DEFAULT_BORDER,
  top: DEFAULT_BORDER,
  left: DEFAULT_BORDER,
  right: DEFAULT_BORDER,
};

export class BorderProperty extends DefaultWidgetProperty<BorderPropertyValue> {
  constructor(params: {
    name: string;
    value?: BorderPropertyValue;
    displayName?: string;
  }) {
    super({
      name: params.name,
      value: params.value ?? DEFAULT_BORDER_PROPERTY_VALUE,
      displayName: params.displayName ?? "border"
    });
  }

  Comp = observer(({}) => {
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
              this.value.isSame = checked;
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
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.top.type = value;
                    draft.right.type = value;
                    draft.bottom.type = value;
                    draft.left.type = value;
                  });
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
                onChange={(updated) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.top.color = updated.toRgbString();
                    draft.right.color = updated.toRgbString();
                    draft.bottom.color = updated.toRgbString();
                    draft.left.color = updated.toRgbString();
                  });
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
                  if (!value) {
                    return;
                  }
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.top.width = value;
                    draft.right.width = value;
                    draft.left.width = value;
                    draft.bottom.width = value;
                  });
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
                    // this.value.top.type = value;
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.top.type = value;
                    });
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
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.top.color = value.toRgbString();
                    });
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
                    if (!value) {
                      return;
                    }
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.top.width = value;
                    });
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
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.right.type = value;
                    });
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
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.right.color = value.toRgbString();
                    });
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
                    if (!value) {
                      return;
                    }
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.right.width = value;
                    });
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
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.bottom.type = value;
                    });
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
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.bottom.color = value.toRgbString();
                    });
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
                    if (!value) {
                      return;
                    }
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.bottom.width = value;
                    });
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
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.left.type = value;
                    });
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
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.left.color = value.toRgbString();
                    });
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
                    if (!value) {
                      return;
                    }
                    this.value = produce(toJS(this.value), (draft) => {
                      draft.left.width = value;
                    });
                  }}
                />
              </Col>
            </Row>
          </Flex>
        )}
      </Flex>
    );
  });

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame === true) {
      style.border = this.createRule(this.value.top);
    }
    if (this.value.isSame === false) {
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

  markup(): ReactNode {
    return <this.Comp />;
  }
}
