import { CSSProperties, useContext } from "react";
import { getRndInteger } from "../../utils";
import { FontPropertyValue } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../ConfigurationPage/widgetproperties/ColorProperty";
import { log } from "../../logging";
import { observer } from "mobx-react-lite";
import FontImport from "../FontImport/FontImport";
import { DynamicText, VariableStoreContext } from "../../stores/VariableStore";

function containerStyle(font: FontPropertyValue): CSSProperties {
  log.debug({ font: font }, "containerStyle");
  const shadow = font.shadows
    .filter((it) => it.blur > 0)
    .reduce((style, shadow) => {
      return (style += `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color},`);
    }, "");
  const shadowStyle = {
    textShadow: `${shadow.substring(0, shadow.length - 1)}`,
  };

  const fontStyle = {
    fontSize: font.size,
    fontFamily: `"${font.family}"`,
    fontWeight: font.weight ? "bolder" : "normal",
    textDecoration: font.underline ? "underline" : "none",
    fontStyle: font.italic ? "italic" : "normal",
    // textDecorationColor: font.color.colors[0].color,
  };

  const strokeStyle = !font.outline.enabled
    ? {}
    : {
        WebkitTextStrokeWidth: font.outline.width,
        WebkitTextStrokeColor: font.outline.color,
      };

  const style = {
    ...fontStyle,
    ...shadowStyle,
    ...strokeStyle,
  };
  log.debug({ font: style }, "calculated font style");
  return style;
}

function wordStyle(font: FontPropertyValue) {
  const color = new ColorProperty({
    name: "color",
    value: font.color,
    displayName: "button-text-color",
    target: ColorPropertyTarget.TEXT,
  }).calcRowColorValue();
  const style: CSSProperties = {};
  if (font.color.gradient) {
    style.color = "transparent";
    style.WebkitTextFillColor = "transparent";
    style.backgroundImage = color;
    style.backgroundClip = "text";
  } else {
    style.color = color;
  }
  if (font.underline) {
    style.textDecoration = "underline";
    style.textDecorationColor = font.color.colors[0].color;
  }
  return style;
}

function calcClassName(font: FontPropertyValue) {
  const fontClassName = "backgroundClipText";
  if (!font.animation || font.animation === "none") {
    return fontClassName;
  }
  let classes = `${fontClassName} animate__animated animate__infinite animate__${font.animation}`;
  if (font.animationSpeed !== "normal") {
    classes = classes.concat(` animate__${font.animationSpeed}`);
  }
  return classes;
}

const TextComponent = observer(
  ({ font, text }: { font: FontPropertyValue; text: string }) => {
    const color = wordStyle(font);
    return (
      <>
        {font.animation === "none" && <div style={color}>{text}</div>}
        {font.animation !== "none" && (
          <>
            {font.animationType === "entire" && (
              <div
                className={`${calcClassName(font)} ${`animate__delay-${getRndInteger(0, 5)}s`}`}
                style={color}
              >
                {text}
              </div>
            )}
            {font.animationType === "word" && (
              <>
                {text.split(" ").map((word, i) => (
                  <>
                    <span
                      key={i}
                      className={`${calcClassName(font)} ${`animate__delay-${getRndInteger(0, 5)}s`}`}
                      style={color}
                    >
                      {word}{" "}
                    </span>
                  </>
                ))}
              </>
            )}
            {font.animationType === "letter" && (
              <>
                {Array.from(text).map((word, i) => (
                  <>
                    <div
                      key={i}
                      style={color}
                      className={`${calcClassName(font)} ${`animate__delay-${getRndInteger(0, 5)}s`}`}
                    >
                      <pre>{word}</pre>
                    </div>
                  </>
                ))}
              </>
            )}
          </>
        )}
      </>
    );
  },
);

export const TextRenderer = observer(
  ({
    font,
    text,
    saveFormatting,
  }: {
    font: FontPropertyValue;
    text: string;
    saveFormatting?: boolean;
  }) => {
    return (
      <>
        <FontImport font={font.family} />
        <div style={containerStyle(font)}>
          {saveFormatting && (
            <pre>
              <TextComponent
                font={font}
                text={text}
              />
            </pre>
          )}
          {!saveFormatting && (
            <TextComponent font={font} text={text} />
          )}
        </div>
      </>
    );
  },
);
