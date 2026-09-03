import { useContext, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { ChatWidgetSettings } from "../ChatWidget/ChatWidgetSettings";
import {
  ChatWidgetV2Renderer,
  ChatWidgetV2Config,
  ChatWidgetV2FontConfig,
} from "./ChatWidgetV2Renderer";
import { eventToMessage, Message } from "../ChatWidget/ChatWidgetStore";
import { onEvent } from "../../utils";
import { FontContext } from "../../stores/FontStore";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";

function fontToConfig(font: AnimatedFontProperty): ChatWidgetV2FontConfig {
  const color =
    new ColorProperty({
      name: "color",
      value: font.value.color,
      displayName: "button-text-color",
      target: ColorPropertyTarget.TEXT,
    }).calcRowColorValue() ?? "#ffffff";
  return {
    family: font.value.family,
    size: font.value.size,
    color,
    gradient: font.value.color.gradient,
    outline: { ...font.value.outline },
    weight: font.value.weight,
    italic: font.value.italic,
    underline: font.value.underline,
    shadows: font.value.shadows.map((s) => ({ ...s })),
  };
}

function settingsToConfig(settings: ChatWidgetSettings): ChatWidgetV2Config {
  return {
    layout: settings.layout,
    alignment: settings.alignment,
    totalGap: settings.totalGap,
    lineGap: settings.lineGap,
    isBlock: settings.isBlock,
    imgSize: settings.authorFont.value.size,
    authorFont: fontToConfig(settings.authorFont),
    messageFont: fontToConfig(settings.messageFont),
    hiddenNicknames: settings.hiddenNicknames,
  };
}

function isChatEvent(type: string): boolean {
  return (
    type === "TWITCH_CHAT_MESSAGE" ||
    type === "VKLIVE_CHAT_MESSAGE" ||
    type === "KICK_CHAT_MESSAGE"
  );
}

export const ChatWidgetV2 = observer(
  ({
    settings,
    initialMessages,
  }: {
    settings: ChatWidgetSettings;
    initialMessages?: Message[];
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<ChatWidgetV2Renderer | null>(null);
    const fonts = useContext(FontContext);
    const config = settingsToConfig(settings);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const renderer = new ChatWidgetV2Renderer(config);
      renderer.mount(container);
      rendererRef.current = renderer;

      initialMessages?.forEach((message) => renderer.addMessage(message));

      const unsubscribe = onEvent((event) => {
        if (isChatEvent(event.type)) {
          renderer.addMessage(eventToMessage(event));
        }
      });

      return () => {
        unsubscribe();
        renderer.destroy();
        rendererRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      rendererRef.current?.updateConfig(config);
    });

    useEffect(() => {
      const families = [
        settings.authorFont.value.family,
        settings.messageFont.value.family,
      ];
      families.forEach((family) => {
        fonts.getImportCss(family).then((css) => {
          if (css) {
            const style = document.createElement("style");
            style.textContent = css;
            document.head.appendChild(style);
          }
        });
      });
    }, [
      fonts,
      settings.authorFont.value.family,
      settings.messageFont.value.family,
    ]);

    return (
      <div
        ref={containerRef}
        style={{
          ...settings.widthProperty.calcCss(),
          ...settings.heightProperty.calcCss(),
        }}
      />
    );
  },
);
