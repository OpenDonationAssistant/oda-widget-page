import { observer } from "mobx-react-lite";
import { CustomWidgetSettings } from "./CustomWidgetSettings";
import { useEffect, useState } from "react";
import { CustomWidgetStore } from "./CustomWidgetStore";

function resolvePlaceholders(str: string, data: any) {
  return str.replace(/(\{\{?\s*[A-Za-z0-9]+?\s*\}?\})/g, (_, expr) => {
    // support "a.b.c" paths
    const path = expr
      .replace(/\{\{?\s*/g, "")
      .replace(/\s*\}?\}/g, "")
      .trim()
      .split(".");
    let cur = data;
    for (const key of path) {
      cur = cur?.[key];
    }
    const result = cur == null ? expr : String(cur);
    console.log(`replacing ${expr} with ${result}`);
    return result;
  });
}

export const CustomWidget = observer(
  ({
    settings,
    store,
  }: {
    settings: CustomWidgetSettings;
    store: CustomWidgetStore;
  }) => {
    const [html, setHtml] = useState<string>("");
    const [css, setCss] = useState<string>("");
    const [js, setJs] = useState<string>("");
    const [doc, setDoc] = useState<string>("");

    useEffect(() => {
      settings.configContent().then((config) => {
        settings
          .htmlContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((content) => {
            setHtml(content);
          });
        settings
          .jsContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((text) => {
            setJs(text);
          });
        settings
          .cssContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((text) => {
            setCss(text);
          });
      });
    }, [settings]);

    useEffect(() => {
      setDoc(
        `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>
          <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
          <style>
            html, body { background: none transparent!important; }
          </style>
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            ${js}
          </script>
          <script>
            function getValue(variables, name) {
              return variables.find((it) => it.name === name)?.value ?? null;
            }

            window.addEventListener("load", function (event) {
              const e = new CustomEvent("onWidgetLoad", {
                detail: ${JSON.stringify(store.session)},
              });

              window.dispatchEvent(e);
              console.log('adding message listener');
              navigator.serviceWorker.addEventListener("message", (message) => {
                const event = message.data;
                console.log({event:event}, "Received message");
                if (event._type === "TWITCH_CHAT_MESSAGE") {
                  const e = new CustomEvent("onEventReceived", {
                    detail: {
                      listener: "message",
                      event: {
                        renderedText: getValue(event._variables, "message_text"),
                        data: {
                          "time": Date.now(),
                          "tags": {
                            "badges": "broadcaster/1",
                            "color": "#641FEF",
                            "display-name": "SenderName",
                            "emotes": "25:5-9",
                            "flags": "",
                            "id": "885d1f33-8387-4206-a668-e9b1409a998b",
                            "mod": "0",
                            "room-id": "85827806",
                            "subscriber": "0",
                            "tmi-sent-ts": "1552400351927",
                            "turbo": "0",
                            "user-id": "85827806",
                            "user-type": ""
                          },
                          "nick": "sendername",
                          "userId": "123123",
                          "displayColor": "#641FEF",
                          "badges": [
                            {
                              "type": "broadcaster",
                              "version": "1",
                              "url": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
                              "description": "Broadcaster"
                            }
                          ],
                          "channel": "channelname",
                          "isAction": false,
                          "emotes": [
                            {
                              "type": "twitch",
                              "name": "Kappa",
                              "id": "25",
                              "gif": false,
                              "urls": {
                                "1": "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                "2": "https://static-cdn.jtvnw.net/emoticons/v1/25/2.0",
                                "4": "https://static-cdn.jtvnw.net/emoticons/v1/25/4.0"
                              },
                              "start": 5,
                              "end": 9
                            }
                          ],
                          "msgId": "885d1f33-8387-4206-a668-e9b1409a99Xb",
                          displayName: getValue(event._variables, "chatter_user_login"),
                          text: getValue(event._variables, "message_text"),
                        }
                      }
                    }
                  });
                  console.log({event:e}, "Sending CustomWidgetEvent");
                  window.dispatchEvent(e);
                }
              });
            });
          </script>
        </body>
      </html>`,
      );
    }, [html, css, js, store.session]);

    return (
      <>
        {doc && (
          <iframe
            width="570px"
            height="570px"
            sandbox="allow-scripts allow-same-origin"
            scrolling="no"
            srcDoc={doc}
            style={{ border: "none", background: "transparent" }}
          />
        )}
      </>
    );
  },
);
