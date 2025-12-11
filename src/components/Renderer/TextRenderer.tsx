import { CSSProperties } from "react";
import { getRndInteger } from "../../utils";
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../ConfigurationPage/widgetproperties/ColorProperty";
import { log } from "../../logging";
import { observer } from "mobx-react-lite";

function containerStyle(font: AnimatedFontProperty): CSSProperties {
  const shadow = font.value.shadows
    .filter((it) => it.blur > 0)
    .reduce((style, shadow) => {
      return (style += `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color},`);
    }, "");
  const shadowStyle = {
    textShadow: `${shadow.substring(0, shadow.length - 1)}`,
  };

  const fontStyle = {
    fontSize: font.value.size,
    fontFamily: `"${font.value.family}"`,
    fontWeight: font.value.weight ? "bolder" : "normal",
    textDecoration: font.value.underline ? "underline" : "none",
    fontStyle: font.value.italic ? "italic" : "normal",
    // textDecorationColor: font.value.color.colors[0].color,
  };

  const strokeStyle = !font.value.outline.enabled
    ? {}
    : {
        WebkitTextStrokeWidth: font.value.outline.width,
        WebkitTextStrokeColor: font.value.outline.color,
      };

  const style = {
    ...fontStyle,
    ...shadowStyle,
    ...strokeStyle,
  };
  log.debug({ font: style }, "calculated font style");
  return style;
}

function wordStyle(font: AnimatedFontProperty) {
  const color = new ColorProperty({
    name: "color",
    value: font.value.color,
    displayName: "button-text-color",
    target: ColorPropertyTarget.TEXT,
  }).calcRowColorValue();
  const style: CSSProperties = {};
  style.textDecorationColor = font.value.color.colors[0].color;
  if (font.value.color.gradient) {
    style.color = "transparent";
    style.WebkitTextFillColor = "transparent";
    style.backgroundImage = color;
    style.backgroundClip = "text";
  } else {
    style.color = color;
  }
  if (font.value.underline) {
    style.textDecoration = "underline";
  }
  return style;
}

export const TextRenderer = observer(
  ({ font, text }: { font: AnimatedFontProperty; text: string }) => {
    const color = wordStyle(font);
    return (
      <>
        {font.createFontImport()}
        <div style={containerStyle(font)}>
          {font.value.animation === "none" && <div style={color}>{text}</div>}
          {font.value.animation !== "none" && (
            <>
              {font.value.animationType === "entire" && (
                <div
                  className={`${font.calcClassName()} ${`animate__delay-${getRndInteger(0, 5)}s`}`}
                  style={color}
                >
                  {text}
                </div>
              )}
              {font.value.animationType === "word" && (
                <>
                  {text.split(" ").map((word, i) => (
                    <>
                      {" "}
                      <div
                        key={i}
                        className={`${font.calcClassName()} ${`animate__delay-${getRndInteger(0, 5)}s`}`}
                        style={color}
                      >
                        {word}
                      </div>
                    </>
                  ))}
                </>
              )}
              {font.value.animationType === "letter" && (
                <>
                  {Array.from(text).map((word, i) => (
                    <>
                      <div
                        key={i}
                        style={color}
                        className={`${font.calcClassName()} ${`animate__delay-${getRndInteger(0, 5)}s`}`}
                      >
                        <pre>{word}</pre>
                      </div>
                    </>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </>
    );
  },
);
