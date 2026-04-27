import { observer } from "mobx-react-lite";
import { StreamCreditsWidgetSettings } from "./StreamCreditsWidgetSettings";
import { useEffect, useState } from "react";
import { StreamCreditsStore } from "./StreamCreditsStore";

const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";

let websocketSessionID: string;

async function registerEventSubListeners(token: string) {
  // Register channel.chat.message
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
          broadcaster_user_id: String(175064269),
          user_id: String(175064269),
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

function handleWebSocketMessage(token: string, data: any) {
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
          console.log(
            `MSG #${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`,
          );

          // Then check to see if that message was "HeyGuys"
          if (data.payload.event.message.text.trim() == "HeyGuys") {
            // If so, send back "VoHiYo" to the chatroom
            // sendChatMessage("VoHiYo")
          }

          break;
      }
      break;
  }
}

function startWebSocketClient(token: string) {
  console.log({ token }, "Starting WebSocket connection");
  let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

  websocketClient.addEventListener("error", console.error);

  websocketClient.addEventListener("open", () => {
    console.log("WebSocket connection opened to " + EVENTSUB_WEBSOCKET_URL);
  });

  websocketClient.addEventListener("message", (data) => {
    handleWebSocketMessage(token, JSON.parse(data.data));
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

    useEffect(() => {
      if (twitchToken !== null) {
        return;
      }
      // RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
      //   .getTwitchAccessToken()
      //   .then((response) => {
      //     setTwitchToken(response.data.token);
      //   });
    }, [settings]);

    useEffect(() => {
      if (twitchToken === null) {
        return;
      }
      // startWebSocketClient(twitchToken);
    }, [twitchToken]);

    return (
      <>
        {creditsStore.donaters.map((donater) => (
          <div>{donater}</div>
        ))}
      </>
    );
  },
);
