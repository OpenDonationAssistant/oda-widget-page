import { observer } from "mobx-react-lite";
import { ProgressElementSettings } from "./ProgressElement";
import { CSSProperties, useContext, useEffect, useState } from "react";
import classes from "./ProgressElementRenderer.module.css";
import {
  Border,
  BorderPropertyValue,
} from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { PaddingPropertyValue } from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingValue } from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import { BoxShadowPropertyValue } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import {
  COLOR_STOP_UNIT,
  ColorPropertyValue,
  GRADIENT_TYPE,
} from "../../ConfigurationPage/widgetproperties/ColorProperty";
import { HeightPropertyValue } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { ImagePropertyValue } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { fullUri } from "../../../utils";
import { VariableStoreContext } from "../../../stores/VariableStore";

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
    style.marginTop = `${value.top}px`;
    style.marginRight = `${value.top}px`;
    style.marginLeft = `${value.top}px`;
    style.marginBottom = `${value.top}px`;
  }
  if (value.isSame === false) {
    style.marginTop = `${value.top}px`;
    style.marginRight = `${value.right}px`;
    style.marginLeft = `${value.left}px`;
    style.marginBottom = `${value.bottom}px`;
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

function calcBarStyle(required: number, collected: number) {
  const filment = Math.floor((collected / required) * 100);
  const style: CSSProperties = {
    width: `${filment < 100 ? filment + "%" : "unset"}`,
  };
  return style;
}

export const ProgressElementRenderer = observer(
  ({ settings }: { settings: ProgressElementSettings }) => {
    const variables = useContext(VariableStoreContext);
    const required = variables.getValue("required", 0) as number;
    const collected = variables.getValue("collected", 0) as number;

    const barPadding = calcPadding(settings.barPadding);
    const backgroundColor = calcBackgroundColor(settings.backgroundColor);
    const progressBarBorderStyle = calcBorder(settings.outerBorder);

    const outerRoundingStyle = calcRounding(settings.outerRounding);
    const outerBoxShadowStyle = calcShadows(settings.outerBoxShadow);
    const [outerBackgroundImage, setOuterBackgroundImage] =
      useState<CSSProperties>({});
    const [innerBackgroundImage, setInnerBackgroundImage] =
      useState<CSSProperties>({});

    const filledBorderStyle = calcBorder(settings.innerBorder);
    const filledRoundingStyle = calcRounding(settings.innerRounding);
    const filledPaddingStyle = calcPadding(settings.innerPadding);
    const filledBoxShadowStyle = calcShadows(settings.innerBoxShadow);
    const filledColor = calcBackgroundColor(settings.filledColor);

    useEffect(() => {
      resolveUri(settings.outerImage).then(setOuterBackgroundImage);
    }, [settings.outerImage]);

    useEffect(() => {
      resolveUri(settings.innerImage).then(setInnerBackgroundImage);
    }, [settings.innerImage]);

    return (
      <>
        <div
          style={{
            ...{ display: "grid", width: "100%", minHeight: "50px", zIndex: 0 },
            ...progressBarBorderStyle,
            ...outerRoundingStyle,
            ...backgroundColor,
            ...barPadding,
            ...outerBoxShadowStyle,
            ...outerBackgroundImage,
            ...calcHeight(settings.outerHeight),
          }}
        >
          <div
            style={{
              ...calcBarStyle(required, collected),
              ...{
                ...{ minHeight: "50px", zIndex: 1 },
                ...filledBorderStyle,
                ...filledRoundingStyle,
                ...filledColor,
                ...filledPaddingStyle,
                ...filledBoxShadowStyle,
                ...innerBackgroundImage,
                ...calcHeight(settings.filledHeight),
              },
            }}
            className={`${classes.goalfilled}`}
          />
        </div>
      </>
    );
  },
);
