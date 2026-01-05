import { observer } from "mobx-react-lite";
import {
  Border,
  BorderPropertyValue,
} from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { PaddingPropertyValue } from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingValue } from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import { BoxShadowPropertyValue } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import {
  COLOR_STOP_UNIT,
  ColorPropertyValue,
  GRADIENT_TYPE,
} from "../../ConfigurationPage/widgetproperties/ColorProperty";
import { WidthPropertyValue } from "../../ConfigurationPage/widgetproperties/WidthProperty";
import { HeightPropertyValue } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { ImagePropertyValue } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { fullUri } from "../../../utils";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import { ContainerElementSettings } from "./ContainerElement";

function createBorderRule(border: Border) {
  return `${border.width}px ${border.type} ${border.color}`;
}

function calcBorder(value: BorderPropertyValue): CSSProperties {
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

function calcPadding(value: PaddingPropertyValue): CSSProperties {
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

function calcRounding(value: RoundingValue): CSSProperties {
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

function calcShadows(value: BoxShadowPropertyValue): CSSProperties {
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

function calcBackgroundColor(setting: ColorPropertyValue): CSSProperties {
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

function calcWidth(value: WidthPropertyValue) {
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

function calcHeight(value: HeightPropertyValue) {
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

function resolveUri(value: ImagePropertyValue) {
  return fullUri(value.url).then((url) => {
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: value.size,
      backgroundRepeat: value.repeat ? "repeat" : "no-repeat",
      opacity: value.opacity,
    };
  });
}

function calcAnimation(value: AnimationPropertyValue): string {
  if (value.animation === "none") {
    return "";
  }
  return `animate__animated animate__${value.animation} animate__infinite`;
}

function calcAnimationDuration(value: AnimationPropertyValue) {
  if (!value.duration) {
    return {};
  }
  return {
    "--animate-duration": `${value.duration / 1000}s`,
  };
}

function calcJustify(value: "top" | "center" | "bottom"): CSSProperties {
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };
  switch (value) {
    case "top":
      style.justifyContent = "flex-start";
      break;
    case "center":
      style.justifyContent = "center";
      break;
    case "bottom":
      style.justifyContent = "flex-end";
      break;
  }
  return style;
}

function calcAlignment(alignment: string): CSSProperties {
  switch (alignment) {
    case "left":
      return { alignItems: "flex-start" };
    case "center":
      return { alignItems: "center" };
    case "right":
      return { alignItems: "flex-end" };
    default:
      return { alignItems: "flex-start" };
  }
}

function calcRotation(value: number): CSSProperties {
  return { transform: `rotate(${value}deg)` };
}

export const ContainerElementRenderer = observer(
  ({
    children,
    settings,
    style,
  }: {
    children: ReactNode;
    settings: ContainerElementSettings;
    style?: CSSProperties;
  }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [imageStyle, setImageStyle] = useState<CSSProperties>({});

    useEffect(() => {
      setLoading(true);
      resolveUri(settings.backgroundImage).then((image) => {
        setImageStyle(image);
        setLoading(false);
      });
    }, [
      settings.backgroundImage.url,
      settings.backgroundImage.name,
      settings.backgroundImage.size,
      settings.backgroundImage.repeat,
      settings.backgroundImage.opacity,
    ]);

    return (
      <>
        {loading && <></>}
        {!loading && (
          <div
            style={{
              ...calcBorder(settings.border),
              ...calcPadding(settings.padding),
              ...calcRounding(settings.rounding),
              ...calcShadows(settings.shadow),
              ...calcBackgroundColor(settings.backgroundColor),
              ...calcWidth(settings.width),
              ...calcHeight(settings.height),
              ...calcJustify(settings.justify),
              ...calcAnimationDuration(settings.animation),
              ...calcRotation(settings.rotation),
              ...imageStyle,
              ...{ overflow: "hidden" },
              ...(style ?? {}),
              ...calcAlignment(settings.align),
            }}
            className={calcAnimation(settings.animation)}
          >
            {children}
          </div>
        )}
      </>
    );
  },
);
