import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import FontImport from "../../FontImport/FontImport";
import AnimatedFontComponent from "./AnimatedFontComponent";
import { produce } from "immer";
import {
  ColorProperty,
  ColorPropertyTarget,
  DEFAULT_COLOR_PROPERTY_VALUE,
} from "./ColorProperty";

export class AnimatedFontProperty extends DefaultWidgetProperty {
  private _label: string;

  constructor(params: {
    widgetId: string;
    name: string;
    value?: any;
    tab?: string;
    label?: string;
  }) {
    super(
      params.widgetId,
      params.name,
      "animatedfont",
      params.value ?? {
        family: "Roboto",
        size: 24,
        color: produce(DEFAULT_COLOR_PROPERTY_VALUE, (draft) => {
          draft.colors[0].color = "#684aff";
        }),
        weight: false,
        italic: false,
        underline: false,
        shadowWidth: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "#000000",
        animation: "none",
        animationType: "entire",
      },
      "",
      params.tab,
    );
    this._label = params.label ?? "widget-font-label";
  }

  copy() {
    return new AnimatedFontProperty({
      widgetId: this.widgetId,
      name: this.name,
      value: this.value,
      tab: this.tab,
      label: this._label,
    });
  }

  calcClassName() {
    const fontClassName = new ColorProperty({
      widgetId: this.widgetId,
      name: "color",
      value: this.value.color,
      displayName: "button-text-color",
      target: ColorPropertyTarget.TEXT,
    }).calcClassName();
    if (!this.value.animation) {
      return fontClassName;
    }
    if (this.value.animation === "none") {
      return fontClassName;
    }
    if (this.value.animation === "pulse") {
      return `${fontClassName} animate__animated animate__infinite animate__${this.value.animation}`;
    }
    return `${fontClassName} animate__animated animate__infinite animate__slow animate__${this.value.animation}`;
  }

  createFontImport() {
    return <FontImport font={this.value.family} />;
  }

  calcStyle(): React.CSSProperties {
    const fontColorStyle = new ColorProperty({
      widgetId: this.widgetId,
      name: "color",
      value: this.value.color,
      displayName: "button-text-color",
      target: ColorPropertyTarget.TEXT,
    }).calcCss();

    const shadowStyle = this.value.shadowWidth
      ? {
          textShadow: `${this.value.shadowOffsetX}px ${this.value.shadowOffsetY}px ${this.value.shadowWidth}px ${this.value.shadowColor}`,
        }
      : {};

    const fontStyle = {
      fontSize: this.value.size,
      fontFamily: this.value.family,
      fontWeight: this.value.weight ? "bold" : "normal",
      textDecoration: this.value.underline ? "underline" : "none",
      fontStyle: this.value.italic ? "italic" : "normal",
    };

    const style = { ...fontColorStyle, ...fontStyle, ...shadowStyle };
    console.log({ result: style });
    return style;
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
