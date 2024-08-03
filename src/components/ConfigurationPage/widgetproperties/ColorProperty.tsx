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

interface ColorPropertyValue {
  gradient: boolean;
  gradientType: GRADIENT_TYPE;
  repeating: boolean;
  colors: ColorStop[];
  angle: number;
}

export const DEFAULT_COLOR_PROPERTY_VALUE = {
  gradient: false,
  gradientType: GRADIENT_TYPE.LINEAR,
  repeating: false,
  colors: [{ color: "#FFFFFF" }],
  angle: 0,
};

export enum ColorPropertyTarget{
  BACKGROUND,
  TEXT,
}

export class ColorProperty extends DefaultWidgetProperty {
  private _target: ColorPropertyTarget;
  constructor({
    widgetId,
    name,
    value,
    displayName,
    tab,
    target
  }: {
    widgetId: string;
    name: string;
    value?: ColorPropertyValue;
    displayName: string;
    tab?: string;
    target: ColorPropertyTarget
  }) {
    super(
      widgetId,
      name,
      "predefined",
      value ?? DEFAULT_COLOR_PROPERTY_VALUE,
      displayName,
      tab,
    );
    this._target = target;
  }

  gradientSettings = (updateConfig: Function) => {
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
                  const updated = produce(
                    this.value,
                    (draft: ColorPropertyValue) => {
                      draft.gradientType = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Flex>
            <Flex align="center" gap={5}>
              <span>Повторять?</span>
              <Switch
                value={this.value.repeating}
                onChange={(value) => {
                  const updated = produce(
                    this.value,
                    (draft: ColorPropertyValue) => {
                      draft.repeating = value;
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
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
                    const updated = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        draft.angle = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Flex>
            )}
          </Flex>
        </Col>
      </Row>
    );
  };

  colorStop = (updateConfig: Function, color: ColorStop, index: number) => {
    return (
      <>
        {color.stop && (
          <Col span={3} offset={1}>
            <InputNumber
              value={color.stop.value}
              onChange={(value) => {
                const updated = produce(
                  this.value,
                  (draft: ColorPropertyValue) => {
                    const stop = draft.colors[index].stop;
                    if (stop && value) {
                      stop.value = value;
                    }
                  },
                );
                updateConfig(this.widgetId, this.name, updated);
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
                    const updated = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        const stop = draft.colors[index].stop;
                        if (stop) {
                          stop.unit = value;
                        }
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              }
            />
          </Col>
        )}
      </>
    );
  };

  addColorToGradient = (updateConfig: Function) => {
    return (
      <Flex justify="space-around" align="center">
        <Button
          className="oda-btn-default"
          onClick={() => {
            const updated = produce(this.value, (draft: ColorPropertyValue) => {
              draft.colors.push({ color: "#FFFFFF" });
            });
            updateConfig(this.widgetId, this.name, updated);
          }}
        >
          Добавить цвет
        </Button>
      </Flex>
    );
  };

  gradientColors = (updateConfig: Function) => {
    return (
      <Flex vertical={true} className="full-width" gap={10}>
        {this.gradientSettings(updateConfig)}
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
                  const updated = produce(
                    this.value,
                    (draft: ColorPropertyValue) => {
                      draft.colors[index].color = value.toRgbString();
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
                }}
              />
            </Col>
            <Col span={3} offset={1}>
              <Flex gap={5} align="center">
                <Switch
                  value={color.stop !== undefined}
                  onChange={(value) => {
                    const updated = produce(
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
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
                <span className={classes.colorStopLabel}>Color Stop</span>
              </Flex>
            </Col>
            {this.colorStop(updateConfig, color, index)}
            {!color.stop && <Col span={4} />}
            <Col span={1} offset={1}>
              <span
                className={`material-symbols-sharp ${classes.deleteButton}`}
                onClick={() => {
                  const updated = produce(
                    this.value,
                    (draft: ColorPropertyValue) => {
                      draft.colors.splice(index, 1);
                    },
                  );
                  updateConfig(this.widgetId, this.name, updated);
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

  markup(updateConfig: Function): ReactNode {
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
                    const updated = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        draft.colors[0].color = value.toRgbString();
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
              </Col>
            )}
            <Col span={10} offset={this.value.gradient ? 12 : 0}>
              <Flex className="full-width" justify="center" gap={5}>
                <Switch
                  value={this.value.gradient}
                  onChange={(value) => {
                    const updated = produce(
                      this.value,
                      (draft: ColorPropertyValue) => {
                        draft.gradient = value;
                      },
                    );
                    updateConfig(this.widgetId, this.name, updated);
                  }}
                />
                <span>Градиент</span>
              </Flex>
            </Col>
          </Row>
        </LabeledContainer>
        {this.value.gradient && this.gradientColors(updateConfig)}
        {this.value.gradient && this.addColorToGradient(updateConfig)}
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
      style.color  = "transparent";
      if (setting.gradient) {
        style.backgroundImage = this.calcRowColorValue();
      } else {
        style.backgroundColor = this.calcRowColorValue();
        style.textDecorationColor = setting.colors[0].color;
      }
    }
    return style;
  }

  calcClassName():string{
    if  (this._target === ColorPropertyTarget.TEXT){
      return  "backgroundClipText";
    }
    return  "";
  }

  calcRowColorValue():  string | undefined {
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
      value = `${setting.repeating  ? "repeating-":""}${type}-gradient(${gradientConfig})`;
    }
    return value;
  }

  copy() {
    return new ColorProperty({
      widgetId: this.widgetId,
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      tab: this.tab,
      target: this._target,
    });
  }
}
