import { CSSProperties, ReactNode } from "react";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import {
  Button,
  Col,
  ColorPicker,
  Flex,
  InputNumber,
  Row,
  Segmented,
  Select,
  Switch,
} from "antd";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { produce } from "immer";
import classes from "./ColorProperty.module.css";
import { Notifier } from "../Notifier";

export enum GRADIENT_TYPE {
  LINEAR,
  RADIAL,
  CONIC,
}

enum COLOR_STOP_UNIT {
  PIXEL,
  PERCENT,
}

interface ColorStop {
  color: string;
  stop?: {
    value: number;
    unit: COLOR_STOP_UNIT;
  };
}

export interface ColorPropertyValue {
  gradient: boolean;
  gradientType: GRADIENT_TYPE;
  repeating: boolean;
  colors: ColorStop[];
  angle: number;
}

export const DEFAULT_COLOR_PROPERTY_VALUE: ColorPropertyValue = {
  gradient: false,
  gradientType: GRADIENT_TYPE.LINEAR,
  repeating: false,
  colors: [{ color: "#FFFFFF" }],
  angle: 0,
};

export enum ColorPropertyTarget {
  BACKGROUND,
  TEXT,
}

export class ColorProperty extends DefaultWidgetProperty<ColorPropertyValue> {
  private _target: ColorPropertyTarget;
  constructor(params: {
    name: string;
    value?: ColorPropertyValue;
    displayName: string;
    target: ColorPropertyTarget;
    notifier: Notifier;
  }) {
    super({
      name: params.name,
      value: params.value ?? DEFAULT_COLOR_PROPERTY_VALUE,
      displayName: params.displayName,
      notifier: params.notifier,
    });
    this._target = params.target;
  }

  gradientSettings = () => {
    return (
      <Row align={"middle"}>
        <Col span={22} offset={2}>
          <Flex align="center" justify="flex-start" gap={20}>
            <Flex align="center" gap={5}>
              <span>Градиент:</span>
              <Segmented
                value={this.value.gradientType}
                options={[
                  {
                    value: GRADIENT_TYPE.LINEAR,
                    label: "Линейный",
                  },
                  {
                    value: GRADIENT_TYPE.RADIAL,
                    label: "Круговой",
                  },
                  {
                    value: GRADIENT_TYPE.CONIC,
                    label: "Конический",
                  },
                ]}
                onChange={(value) => {
                  this.value = produce(
                    this.value,
                    (draft: ColorPropertyValue) => {
                      draft.gradientType = value;
                    },
                  );
                }}
              />
            </Flex>
            <Flex align="center" gap={5}>
              <span>Повторять?</span>
              <Switch
                value={this.value.repeating}
                onChange={(value) => {
                  this.value = produce(
                    this.value,
                    (draft: ColorPropertyValue) => {
                      draft.repeating = value;
                    },
                  );
                }}
              />
            </Flex>
            {this.value.gradientType === GRADIENT_TYPE.LINEAR && (
              <Flex align="center" gap={5}>
                <span>Наклон:</span>
                <InputNumber
                  className={`${classes.angleinput}`}
                  value={this.value.angle}
                  addonAfter="Deg"
                  onChange={(value) => {
                    if (!value) {
                      return;
                    }
                    this.value = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        draft.angle = value;
                      },
                    );
                  }}
                />
              </Flex>
            )}
          </Flex>
        </Col>
      </Row>
    );
  };

  colorStop = (color: ColorStop, index: number) => {
    return (
      <>
        {color.stop && (
          <Col span={3} offset={1}>
            <InputNumber
              value={color.stop.value}
              onChange={(value) => {
                this.value = produce(
                  this.value,
                  (draft: ColorPropertyValue) => {
                    const stop = draft.colors[index].stop;
                    if (stop && value) {
                      stop.value = value;
                    }
                  },
                );
              }}
              addonAfter={
                <Select
                  value={color.stop.unit}
                  options={[
                    {
                      value: COLOR_STOP_UNIT.PIXEL,
                      label: "px",
                    },
                    {
                      value: COLOR_STOP_UNIT.PERCENT,
                      label: "%",
                    },
                  ]}
                  onChange={(value) => {
                    this.value = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        const stop = draft.colors[index].stop;
                        if (stop) {
                          stop.unit = value;
                        }
                      },
                    );
                  }}
                />
              }
            />
          </Col>
        )}
      </>
    );
  };

  addColorToGradient = () => {
    return (
      <Flex justify="space-around" align="center">
        <Button
          className="oda-btn-default"
          onClick={() => {
            this.value = produce(this.value, (draft: ColorPropertyValue) => {
              draft.colors.push({ color: "#FFFFFF" });
            });
          }}
        >
          Добавить цвет
        </Button>
      </Flex>
    );
  };

  gradientColors = () => {
    return (
      <Flex vertical={true} className="full-width" gap={10}>
        {this.gradientSettings()}
        {this.value.colors.map((color: ColorStop, index: number) => (
          <Row align="middle" className="full-width">
            <Col span={2} offset={4}>
              Цвет #{index + 1}
            </Col>
            <Col span={3}>
              <ColorPicker
                key={index}
                showText
                value={color.color}
                onChange={(value) => {
                  this.value = produce(
                    this.value,
                    (draft: ColorPropertyValue) => {
                      draft.colors[index].color = value.toRgbString();
                    },
                  );
                }}
              />
            </Col>
            <Col span={3} offset={1}>
              <Flex gap={5} align="center">
                <Switch
                  value={color.stop !== undefined}
                  onChange={(value) => {
                    this.value = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        if (value) {
                          draft.colors[index].stop = {
                            value: 0,
                            unit: COLOR_STOP_UNIT.PIXEL,
                          };
                        } else {
                          draft.colors[index].stop = undefined;
                        }
                      },
                    );
                  }}
                />
                <span className={classes.colorStopLabel}>Color Stop</span>
              </Flex>
            </Col>
            {this.colorStop(color, index)}
            {!color.stop && <Col span={4} />}
            <Col span={1} offset={1}>
              <span
                className={`material-symbols-sharp ${classes.deleteButton}`}
                onClick={() => {
                  this.value = produce(
                    this.value,
                    (draft: ColorPropertyValue) => {
                      draft.colors.splice(index, 1);
                    },
                  );
                }}
              >
                delete
              </span>
            </Col>
          </Row>
        ))}
      </Flex>
    );
  };

  markup(): ReactNode {
    return (
      <Flex gap={10} vertical={true}>
        <LabeledContainer displayName={this.displayName}>
          <Row align="middle" className="full-width">
            {!this.value.gradient && (
              <Col span={8} offset={4}>
                <ColorPicker
                  value={this.value.colors[0].color}
                  style={{ width: "50%" }}
                  showText
                  onChange={(value) => {
                    this.value = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        draft.colors[0].color = value.toRgbString();
                      },
                    );
                  }}
                />
              </Col>
            )}
            <Col span={10} offset={this.value.gradient ? 12 : 0}>
              <Flex className="full-width" justify="center" gap={5}>
                <Switch
                  value={this.value.gradient}
                  onChange={(value) => {
                    this.value = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        draft.gradient = value;
                      },
                    );
                  }}
                />
                <span>Градиент</span>
              </Flex>
            </Col>
          </Row>
        </LabeledContainer>
        {this.value.gradient && this.gradientColors()}
        {this.value.gradient && this.addColorToGradient()}
      </Flex>
    );
  }

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    const setting = this.value as ColorPropertyValue;
    if (this._target === ColorPropertyTarget.BACKGROUND) {
      style.background = this.calcRowColorValue();
    }
    if (this._target === ColorPropertyTarget.TEXT) {
      if (setting.gradient) {
        style.color = "transparent";
        style.backgroundImage = this.calcRowColorValue();
      } else {
        style.color = this.calcRowColorValue();
        style.textDecorationColor = setting.colors[0].color;
      }
    }
    return style;
  }

  calcClassName(): string {
    if (this._target === ColorPropertyTarget.TEXT) {
      return "backgroundClipText";
    }
    return "";
  }

  calcRowColorValue(): string | undefined {
    const setting = this.value as ColorPropertyValue;
    let value = setting.colors.at(0)?.color;
    if (setting.gradient) {
      let type = "linear";
      switch (setting.gradientType) {
        case GRADIENT_TYPE.LINEAR:
          type = "linear";
          break;
        case GRADIENT_TYPE.RADIAL:
          type = "radial";
          break;
        case GRADIENT_TYPE.CONIC:
          type = "conic";
          break;
      }
      const colors = setting.colors
        .map((stop) => {
          const stopValue = stop.stop?.value ?? 0;
          const stopUnit = stop.stop?.unit ?? COLOR_STOP_UNIT.PIXEL;
          let unit = "px";
          switch (stopUnit) {
            case COLOR_STOP_UNIT.PIXEL:
              unit = "px";
              break;
            case COLOR_STOP_UNIT.PERCENT:
              unit = "%";
              break;
          }
          return stopValue ? `${stop.color} ${stopValue}${unit}` : stop.color;
        })
        .join(",");
      const gradientConfig =
        setting.gradientType === GRADIENT_TYPE.LINEAR
          ? `${setting.angle}deg,${colors}`
          : colors;
      value = `${
        setting.repeating ? "repeating-" : ""
      }${type}-gradient(${gradientConfig})`;
    }
    return value;
  }
}
