import { observer } from "mobx-react-lite";
import { ChatWidgetSettings } from "./ChatWidgetSettings";
import { ChatWidgetStore } from "./ChatWidgetStore";
import { Flex } from "antd";
import { TextRenderer } from "../../components/Renderer/TextRenderer";
import classes from "./ChatWidget.module.css";

export const ChatWidget = observer(
  ({
    settings,
    store,
  }: {
    settings: ChatWidgetSettings;
    store: ChatWidgetStore;
  }) => {
    let totalAlignment = "flex-start";
    switch (settings.alignment) {
      case "left":
        totalAlignment = "flex-start";
        break;
      case "center":
        totalAlignment = "center";
        break;
      case "right":
        totalAlignment = "flex-end";
        break;
    }

    const imgSize = settings.authorFont.value.size;

    return (
      <Flex
        vertical={settings.layout === "vertical"}
        gap={settings.totalGap}
        style={{
          ...{ alignItems: totalAlignment },
          ...settings.widthProperty.calcCss(),
          ...settings.heightProperty.calcCss(),
        }}
      >
        {settings.isBlock &&
          store.messages.map((message) => (
            <Flex gap={settings.lineGap} align="flex-start">
              {message.badges.map((badge: { url: string }) => (
                  <img src={badge.url} width={imgSize} height={imgSize} />
                ))}
              <TextRenderer
                font={settings.authorFont}
                text={String(message.get("chatter_user_login"))}
              />
              <TextRenderer
                font={settings.messageFont}
                text={String(message.get("message_text"))}
              />
            </Flex>
          ))}
        {!settings.isBlock &&
          store.messages.map((message) => (
            <span>
              {message.badges.map((badge: { url: string }) => (
                <img
                  id={badge.url}
                  className={classes.icon}
                  src={badge.url}
                  width={imgSize}
                  height={imgSize}
                />
              ))}
              <TextRenderer
                font={settings.authorFont}
                className={classes.inlined}
                text={message.nickname + ": "}
              />
              {message.parts.map((part) => {
                if (part.type === "emote") {
                  return (
                    <img
                      id={part.url}
                      className={classes.icon}
                      src={part.url}
                      width={imgSize}
                      height={imgSize}
                    />
                  );
                }
                if (part.type === "string") {
                  return (
                    <TextRenderer
                      font={settings.messageFont}
                      className={classes.inlined}
                      text={part.text ?? ""}
                    />
                  );
                }
              })}
            </span>
          ))}
      </Flex>
    );
  },
);
