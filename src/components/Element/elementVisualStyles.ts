import { CSSProperties } from "react";
import {
  Border,
  BorderPropertyValue,
} from "../ConfigurationPage/widgetproperties/BorderProperty";
import { PaddingPropertyValue } from "../ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingValue } from "../ConfigurationPage/widgetproperties/RoundingProperty";
import { BoxShadowPropertyValue } from "../ConfigurationPage/widgetproperties/BoxShadowProperty";
import {
  COLOR_STOP_UNIT,
  ColorPropertyValue,
  GRADIENT_TYPE,
} from "../ConfigurationPage/widgetproperties/ColorProperty";
import { WidthPropertyValue } from "../ConfigurationPage/widgetproperties/WidthProperty";
import { HeightPropertyValue } from "../ConfigurationPage/widgetproperties/HeightProperty";
import { ImagePropertyValue } from "../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { AnimationPropertyValue } from "../ConfigurationPage/widgetproperties/AnimationProperty";
import { fullUri } from "../../utils";

function createBorderRule(border: Border) {
  return `${border.width}px ${border.type} ${border.color}`;
}

export function calcBorder(value: BorderPropertyValue): CSSProperties {
  const style: CSSProperties = {};
  style.borderTop = "none";
  style.borderRight = "none";
  style.borderLeft = "none";
  style.borderBottom = "none";
  if (value.isSame === true) {
    const rule = createBorderRule(value.top);
    style.borderTop = rule;
    style.borderRight = rule;
    style.borderLeft = rule;
    style.borderBottom = rule;
  }
  if (value.isSame === false) {
    style.borderTop = createBorderRule(value.top);
    style.borderRight = createBorderRule(value.right);
    style.borderLeft = createBorderRule(value.left);
    style.borderBottom = createBorderRule(value.bottom);
  }
  return style;
}

export function calcPadding(value: PaddingPropertyValue): CSSProperties {
  const style: CSSProperties = {};
  if (value.isSame === true) {
    style.paddingTop = `${value.top}px`;
    style.paddingRight = `${value.top}px`;
    style.paddingLeft = `${value.top}px`;
    style.paddingBottom = `${value.top}px`;
  }
  if (value.isSame === false) {
    style.paddingTop = `${value.top}px`;
    style.paddingRight = `${value.right}px`;
    style.paddingLeft = `${value.left}px`;
    style.paddingBottom = `${value.bottom}px`;
  }
  return style;
}

export function calcRounding(value: RoundingValue): CSSProperties {
  const style: CSSProperties = {};
  if (value.isSame) {
    style.borderTopRightRadius = value.topLeft + "px";
    style.borderBottomRightRadius = value.topLeft + "px";
    style.borderBottomLeftRadius = value.topLeft + "px";
    style.borderTopLeftRadius = value.topLeft + "px";
  } else {
    style.borderTopRightRadius = value.topRight + "px";
    style.borderBottomRightRadius = value.bottomRight + "px";
    style.borderBottomLeftRadius = value.bottomLeft + "px";
    style.borderTopLeftRadius = value.topLeft + "px";
  }
  return style;
}

export function calcShadows(value: BoxShadowPropertyValue): CSSProperties {
  let result = "";
  value.shadows.forEach((shadow) => {
    if (result.length > 0) {
      result += ", ";
    }
    result += `${shadow.inset ? "inset " : ""}${shadow.x}px ${shadow.y}px ${
      shadow.blur
    }px ${shadow.spread}px ${shadow.color}`;
  });
  if (result.length === 0) {
    result = "none";
  }
  return { boxShadow: result };
}

export function calcBackgroundColor(setting: ColorPropertyValue): CSSProperties {
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
  return { background: value };
}

export function calcWidth(value: WidthPropertyValue): CSSProperties {
  const style: CSSProperties = {};
  switch (value.type) {
    case "min":
      style.width = "min-content";
      break;
    case "max":
      style.width = "100%";
      break;
    case "fixed":
      style.width = `${value.value}px`;
      break;
  }
  return style;
}

export function calcHeight(value: HeightPropertyValue): CSSProperties {
  const style: CSSProperties = {};
  switch (value.type) {
    case "min":
      style.height = "min-content";
      break;
    case "max":
      style.height = "100%";
      break;
    case "fixed":
      style.height = `${value.value}px`;
      break;
  }
  return style;
}

export function resolveUri(value: ImagePropertyValue): Promise<CSSProperties> {
  return fullUri(value.url).then((url) => {
    if (!url) {
      return {};
    }
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: value.size,
      backgroundRepeat: value.repeat ? "repeat" : "no-repeat",
      opacity: value.opacity,
    };
  });
}

export function calcAnimation(value: AnimationPropertyValue): string {
  if (value.animation === "none") {
    return "";
  }
  return `animate__animated animate__${value.animation} animate__infinite`;
}

export function calcAnimationDuration(
  value: AnimationPropertyValue,
): CSSProperties {
  if (!value.duration) {
    return {};
  }
  return {
    "--animate-duration": `${value.duration / 1000}s`,
  } as CSSProperties;
}

export function calcRotation(value: number): CSSProperties {
  return { transform: `rotate(${value}deg)` };
}
