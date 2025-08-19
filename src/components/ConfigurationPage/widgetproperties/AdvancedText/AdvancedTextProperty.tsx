import { ReactNode } from "react";
import { produce } from "immer";
import {
  ColorProperty,
  ColorPropertyTarget,
  ColorPropertyValue,
  DEFAULT_COLOR_PROPERTY_VALUE,
} from "../ColorProperty";
import { log } from "../../../../logging";
import { toJS } from "mobx";
import { DefaultWidgetProperty } from "../WidgetProperty";
import { AdvancedTextPropertyComponent } from "./AdvancedTextPropertyComponent";
import {
  DEFAULT_IMAGE_PROPERTY_VALUE,
  ImagePropertyValue,
} from "../BackgroundImageProperty";

export interface TextOutline {
  enabled: boolean;
  width: number;
  color: string;
}

export interface TextValue {
  value: string;
  showText: boolean;
  hideIfEmpty: boolean;
  family: string;
  size: number;
  color: ColorPropertyValue;
  outline: TextOutline;
  weight: boolean;
  italic: boolean;
  underline: boolean;
  shadowWidth: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  animation: string;
  animationType: string;
}

export const DEFAULT_TEXT_VALUE = {
  text: "",
  showText: true,
  hideIfEmpty: false,
  family: "Roboto",
  size: 24,
  color: produce(DEFAULT_COLOR_PROPERTY_VALUE, (draft) => {
    draft.colors[0].color = "#684aff";
  }),
  outline: {
    enabled: false,
    width: 0,
    color: "#000000",
  },
  weight: false,
  italic: false,
  underline: false,
  shadowWidth: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: "#000000",
  animation: "none",
  animationType: "entire",
};

export interface AdvancedTextPropertyValue {
  text: TextValue;
  background: ColorPropertyValue;
  backgroundImage: ImagePropertyValue;
}

export const DEFAULT_ADVANCED_TEXT_PROPERTY_VALUE = {
  text: DEFAULT_TEXT_VALUE,
  background: DEFAULT_COLOR_PROPERTY_VALUE,
  backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
};

export class AdvancedTextProperty extends DefaultWidgetProperty<AdvancedTextPropertyValue> {
  private _label: string;

  constructor(params: {
    name: string;
    value?: AdvancedTextPropertyValue;
    label?: string;
  }) {
    super({
      name: params.name,
      value: {
        ...DEFAULT_ADVANCED_TEXT_PROPERTY_VALUE,
        ...(params.value ?? {}),
      },
      displayName: params.label ?? "widget-font",
    });
    this._label = params.label ?? "widget-font-label";
  }

  public get className() {
    const fontClassName = new ColorProperty({
      name: "color",
      value: this.text.color,
      displayName: "button-text-color",
      target: ColorPropertyTarget.TEXT,
    }).calcClassName();
    if (!this.text.animation) {
      return fontClassName;
    }
    if (this.text.animation === "none") {
      return fontClassName;
    }
    if (this.text.animation === "pulse") {
      return `${fontClassName} animate__animated animate__infinite animate__${this.text.animation}`;
    }
    return `${fontClassName} animate__animated animate__infinite animate__slow animate__${this.text.animation}`;
  }

  // TODO add zIndex and opacity
  public get css(): React.CSSProperties {
    const fontColorStyle = new ColorProperty({
      name: "color",
      value: this.text.color,
      displayName: "button-text-color",
      target: ColorPropertyTarget.TEXT,
    }).calcCss();

    const shadowStyle = this.text.shadowWidth
      ? {
          textShadow: `${this.text.shadowOffsetX}px ${this.text.shadowOffsetY}px ${this.text.shadowWidth}px ${this.text.shadowColor}`,
        }
      : {};

    const fontStyle = {
      fontSize: this.text.size,
      fontFamily: `"${this.text.family}"`,
      fontWeight: this.text.weight ? "bolder" : "normal",
      textDecoration: this.text.underline ? "underline" : "none",
      fontStyle: this.text.italic ? "italic" : "normal",
    };

    const strokeStyle = !this.text.outline.enabled
      ? {}
      : {
          WebkitTextStrokeWidth: this.text.outline.width,
          WebkitTextStrokeColor: this.text.outline.color,
        };

    const style = {
      ...fontColorStyle,
      ...fontStyle,
      ...shadowStyle,
      ...strokeStyle,
    };
    log.debug({ font: style }, "calculated font style");
    return style;
  }

  copy() {
    return new AdvancedTextProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      label: this.label,
    });
  }

  public get text() {
    return this.value.text;
  }

  markup(): ReactNode {
    return <AdvancedTextPropertyComponent property={this} />;
  }

  public set label(value: string) {
    this._label = value;
  }
  public get label(): string {
    return this._label;
  }
}
