import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { ColorPropertyComponent } from "./ColorPropertyComponent";
import { log } from "../../../logging";
import { toJS } from "mobx";
import { produce } from "immer";

export enum GRADIENT_TYPE {
  LINEAR,
  RADIAL,
  CONIC,
}

export enum COLOR_STOP_UNIT {
  PIXEL,
  PERCENT,
}

export interface ColorStop {
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
  }) {
    super({
      name: params.name,
      value: params.value ?? DEFAULT_COLOR_PROPERTY_VALUE,
      displayName: params.displayName,
    });
    this._target = params.target;
  }

  copy() {
    return new ColorProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      displayName: this.displayName,
      target: this._target,
    });
  }

  markup(): ReactNode {
    return <ColorPropertyComponent property={this} />;
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
        style.WebkitTextFillColor = "transparent";
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
    log.debug(
      { name: this.name, config: toJS(this.value) },
      "calculating row color value",
    );
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
