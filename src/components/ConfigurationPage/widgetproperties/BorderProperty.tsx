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
import { getObserverTree, makeAutoObservable, makeObservable, observable, observe, reaction } from "mobx";
import { log } from "../../../logging";

export class Border {
  private _width: number = 1;
  private _color: string = "#FFFFFF";
  private _type: string = "solid";

  constructor() {
    makeAutoObservable(this);
  }

  public get color() {
    return this._color;
  }
  public set color(value: string) {
    this._color = value;
  }
  public get type(): string {
    return this._type;
  }
  public set type(value: string) {
    this._type = value;
  }
  public get width(): number {
    return this._width;
  }
  public set width(value: number) {
    this._width = value;
  }
}

export class BorderPropertyValue {
  isSame: boolean | null = null;
  bottom = new Border();
  top = new Border();
  left = new Border();
  right = new Border();

  constructor() {
    makeAutoObservable(this);
  }
}

export class BorderProperty extends DefaultWidgetProperty<BorderPropertyValue> {
  constructor(params: {
    name: string;
    value?: BorderPropertyValue;
    displayName: string;
  }) {
    super({
      name: params.name,
      value: params.value ?? new BorderPropertyValue(),
      displayName: params.displayName,
    });
    observe(this, "changed", () => {
      log.debug("border changed");
    });
    reaction(() => this.changed, () => {
      log.debug("border changed", this.value);
    });
    log.debug({borderTree: getObserverTree(this, "changed")});
  }

  comp = () => {
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
              this.checkChanged();
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
                  this.value.top.type = value;
                  this.value.right.type = value;
                  this.value.bottom.type = value;
                  this.value.left.type = value;
                  this.checkChanged();
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
                  this.value.top.color = updated.toRgbString();
                  this.value.right.color = updated.toRgbString();
                  this.value.bottom.color = updated.toRgbString();
                  this.value.left.color = updated.toRgbString();
                  this.checkChanged();
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
                  this.value.top.width = value;
                  this.value.right.width = value;
                  this.value.left.width = value;
                  this.value.bottom.width = value;
                  this.checkChanged();
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
                    this.value.top.type = value;
                    this.checkChanged();
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
                    this.value.top.color = value.toRgbString();
                    this.checkChanged();
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
                    this.value.top.width = value;
                    this.checkChanged();
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
                    this.value.right.type = value;
                    this.checkChanged();
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
                    this.value.right.color = value.toRgbString();
                    this.checkChanged();
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
                    this.value.right.width = value;
                    this.checkChanged();
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
                    this.value.bottom.type = value;
                    this.checkChanged();
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
                    this.value.bottom.color = value.toRgbString();
                    this.checkChanged();
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
                    this.value.bottom.width = value;
                    this.checkChanged();
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
                    this.value.left.type = value;
                    this.checkChanged();
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
                    this.value.left.color = value.toRgbString();
                    this.checkChanged();
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
                    this.value.left.width = value;
                    this.checkChanged();
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
    return this.comp();
  }
}
