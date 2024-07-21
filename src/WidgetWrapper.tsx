import React, { ReactNode, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "./types/WidgetData";
import { WidgetSettingsContext } from "./contexts/WidgetSettingsContext";
import {
  cleanupCommandListener,
  setupCommandListener,
  subscribe,
  unsubscribe,
} from "./socket";
import { messageCallbackType } from "@stomp/stompjs";
import { ApiContext } from "./contexts/ApiContext";
import axios from "axios";

const overflowHiddenForRootElement = (
  <style
    dangerouslySetInnerHTML={{
      __html: `#root {overflow: hidden;}`,
    }}
  />
);

const fullHeight = (
  <style
    dangerouslySetInnerHTML={{
      __html: `html, body { height: 100%; }`,
    }}
  />
);


export default function WidgetWrapper({ children }: { children: ReactNode }) {
  const { recipientId, settings, widgetId } = useLoaderData() as WidgetData;
  const navigate = useNavigate();

  useEffect(() => {
    setupCommandListener(widgetId, () => navigate(0));
    return () => {
      cleanupCommandListener(widgetId);
    };
  }, [widgetId]);

  return (
    <>
      {overflowHiddenForRootElement}
      {fullHeight}
      <WidgetSettingsContext.Provider
        value={{
          widgetId: widgetId,
          settings: settings,
          subscribe: (topic: string, onMessage: messageCallbackType) => {
            subscribe(widgetId, topic, onMessage);
          },
          unsubscribe: (topic: string) => {
            unsubscribe(widgetId, topic);
          },
        }}
      >
        <ApiContext.Provider
          value={{
            listDonaters: (period: string) =>
              axios
                .get(
                  `${process.env.REACT_APP_RECIPIENT_API_ENDPOINT}/recipients/${recipientId}/donaters?period=${period}`,
                )
                .then((response) => response.data),
          }}
        >
        {children}
        </ApiContext.Provider>
      </WidgetSettingsContext.Provider>
    </>
  );
}
