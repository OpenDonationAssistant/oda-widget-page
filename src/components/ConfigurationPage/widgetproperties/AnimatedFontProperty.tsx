import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import FontImport from "../../FontImport/FontImport";
import { produce } from "immer";
import {
  ColorProperty,
  ColorPropertyTarget,
  ColorPropertyValue,
  DEFAULT_COLOR_PROPERTY_VALUE,
} from "./ColorProperty";
import { log } from "../../../logging";
import { AnimatedFontComponent } from "./AnimatedFontComponent";
import { toJS } from "mobx";

export interface TextOutline {
  enabled: boolean;
  width: number;
  color: string;
}

export interface TextShadow {
  x: number;
  y: number;
  blur: number;
  color: string;
}

export interface FontPropertyValue {
  family: string;
  size: number;
  color: ColorPropertyValue;
  outline: TextOutline;
  weight: boolean;
  italic: boolean;
  underline: boolean;
  shadows: TextShadow[];
  animation: string;
  animationType: "entire" | "word" | "letter";
  animationSpeed: string;
}

export const DEFAULT_FONT_PROPERTY_VALUE = {
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
  shadows: [],
  animation: "none",
  animationType: "entire",
  animationSpeed: "slow",
};

export class AnimatedFontProperty extends DefaultWidgetProperty<FontPropertyValue> {
  private _label: string;

  constructor(params: {
    name: string;
    value?: FontPropertyValue;
    label?: string;
  }) {
    super({
      name: params.name,
      value: {
        ...DEFAULT_FONT_PROPERTY_VALUE,
        ...(params.value ?? {}),
      },
      displayName: "animatedfont",
    });
    this._label = params.label ?? "widget-font-label";
  }

  calcClassName() {
    const fontClassName = new ColorProperty({
      name: "color",
      value: this.value.color,
      displayName: "button-text-color",
      target: ColorPropertyTarget.TEXT,
    }).calcClassName();
    if (!this.value.animation || this.value.animation === "none") {
      return fontClassName;
    }
    let classes = `${fontClassName} animate__animated animate__infinite animate__${this.value.animation}`;
    if (this.value.animationSpeed !== "normal") {
      classes = classes.concat(` animate__${this.value.animationSpeed}`);
    }
    return classes;
  }

  createFontImport() {
    return <FontImport font={this.value.family} />;
  }

  calcStyle(): React.CSSProperties {
    const fontColorStyle = new ColorProperty({
      name: "color",
      value: this.value.color,
      displayName: "button-text-color",
      target: ColorPropertyTarget.TEXT,
    }).calcCss();

    const shadow = this.value.shadows
      .filter((it) => it.blur > 0)
      .reduce((style, shadow) => {
        return (style += `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color},`);
      }, "");
    const shadowStyle = {
      textShadow: `${shadow.substring(0, shadow.length - 1)}`,
    };

    const fontStyle = {
      fontSize: this.value.size,
      fontFamily: `"${this.value.family}"`,
      fontWeight: this.value.weight ? "bolder" : "normal",
      textDecoration: this.value.underline ? "underline" : "none",
      fontStyle: this.value.italic ? "italic" : "normal",
    };

    const strokeStyle = !this.value.outline.enabled
      ? {}
      : {
          WebkitTextStrokeWidth: this.value.outline.width,
          WebkitTextStrokeColor: this.value.outline.color,
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
    return new AnimatedFontProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      label: this.label,
    });
  }

  markup(): ReactNode {
    return <AnimatedFontComponent property={this} />;
  }

  public set label(value: string) {
    this._label = value;
  }
  public get label(): string {
    return this._label;
  }
}
