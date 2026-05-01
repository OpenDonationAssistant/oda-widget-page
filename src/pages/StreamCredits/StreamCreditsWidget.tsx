import { observer } from "mobx-react-lite";
import { StreamCreditsWidgetSettings } from "./StreamCreditsWidgetSettings";
import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { useEffect, useState } from "react";
import { StreamCreditsStore } from "./StreamCreditsStore";
import Marquee from "react-fast-marquee";
import { Flex } from "antd";

const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";

let websocketSessionID: string;

function isDigitsOnly(s: string) {
  return /^\d+$/.test(s);
}

async function getTwitchUserId(token: string) {
  const response = await fetch("https://id.twitch.tv/oauth2/validate", {
    method: "GET",
    headers: {
      Authorization: "OAuth " + token,
    },
  });
  const json = await response.json();
  return json.user_id;
}

async function registerEventSubListeners(token: string) {
  // Register channel.chat.message
  let userId = await getTwitchUserId(token);
  let response = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Client-Id": "2f9aljaudj3678kp4gc9bj99tb7bev",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "channel.chat.message",
        version: "1",
        condition: {
          broadcaster_user_id: userId,
          user_id: userId,
        },
        transport: {
          method: "websocket",
          session_id: websocketSessionID,
        },
      }),
    },
  );

  if (response.status != 202) {
    let data = await response.json();
    console.error(
      "Failed to subscribe to channel.chat.message. API call returned status code " +
        response.status,
    );
    console.error(data);
  } else {
    const data = await response.json();
    console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);
  }
}

function handleWebSocketMessage(
  token: string,
  data: any,
  store: StreamCreditsStore,
) {
  switch (data.metadata.message_type) {
    case "session_welcome": // First message you get from the WebSocket server when connecting
      websocketSessionID = data.payload.session.id; // Register the Session ID it gives us

      // Listen to EventSub, which joins the chatroom from your bot's account
      registerEventSubListeners(token);
      break;
    case "notification": // An EventSub notification has occurred, such as channel.chat.message
      switch (data.metadata.subscription_type) {
        case "channel.chat.message":
          // First, print the message to the program's console.
          // console.log(
          //   `MSG #${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`,
          // );

          if (isDigitsOnly(data.payload.event.message.text.trim())) {
            store.addVoter(data.payload.event.chatter_user_login);
          }

          break;
      }
      break;
  }
}

function startWebSocketClient(token: string, store: StreamCreditsStore) {
  console.log({ token }, "Starting WebSocket connection");
  let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

  websocketClient.addEventListener("error", console.error);

  websocketClient.addEventListener("open", () => {
    console.log("WebSocket connection opened to " + EVENTSUB_WEBSOCKET_URL);
  });

  websocketClient.addEventListener("message", (data) => {
    handleWebSocketMessage(token, JSON.parse(data.data), store);
  });

  return websocketClient;
}

export const StreamCreditsWidget = observer(
  ({
    settings,
    creditsStore,
  }: {
    settings: StreamCreditsWidgetSettings;
    creditsStore: StreamCreditsStore;
  }) => {
    const [twitchToken, setTwitchToken] = useState<string | null>(null);
    const [show, setShow] = useState<boolean>(true);

    useEffect(() => {
      if (twitchToken !== null) {
        return;
      }
      RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
        .getTwitchAccessToken()
        .then((response) => {
          setTwitchToken(response.data.token);
        });
    }, [settings]);

    useEffect(() => {
      if (twitchToken === null) {
        return;
      }
      if (creditsStore === null) {
        return;
      }
      startWebSocketClient(twitchToken, creditsStore);
    }, [twitchToken, creditsStore]);

    const creditFontStyle = settings.creditsFontProperty.calcStyle();
    const titleFontStyle = settings.titleFontProperty.calcStyle();

    return (
      <>
        {settings.titleFontProperty.createFontImport()}
        {settings.creditsFontProperty.createFontImport()}
        {show && (
          <Flex vertical style={{ transform: "rotate(90deg)" }}>
            <Marquee
              delay={3}
              loop={1}
              speed={settings.speedProperty.value}
              onFinish={() => setShow(false)}
              direction="left"
              style={{ height: "100vw", width: "100vh" }}
            >
              <Flex
                vertical
                align="center"
                style={{ transform: "rotate(-90deg)" }}
              >
                <div style={titleFontStyle}>
                  Танцующие на столе (участники квиза)
                </div>
                {creditsStore.voters.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex
                vertical
                align="center"
                style={{ transform: "rotate(-90deg)" }}
              >
                <div style={titleFontStyle}>
                  Новые посетители таверны (фоллоу)
                </div>
                {creditsStore.newFollowers.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex
                vertical
                align="center"
                style={{ transform: "rotate(-90deg)" }}
              >
                <div style={titleFontStyle}>
                  Пришли в своей компании (рейдеры)
                </div>
                {creditsStore.raiders.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex
                vertical
                align="center"
                style={{ transform: "rotate(-90deg)" }}
              >
                <div style={titleFontStyle}>
                  Угостили лисят в баре (подарочные подписки)
                </div>
                {creditsStore.gifters.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex
                vertical
                align="center"
                style={{ transform: "rotate(-90deg)" }}
              >
                <div style={titleFontStyle}>
                  Подкинули бармену на отпуск (донатеры)
                </div>
                {creditsStore.donaters.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
            </Marquee>
          </Flex>
        )}
      </>
    );
  },
);
