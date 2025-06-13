import { ReactNode, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "./types/WidgetData";
import { WidgetSettingsContext } from "./contexts/WidgetSettingsContext";
import {
  cleanupCommandListener,
  publish,
  setupCommandListener,
  subscribe,
  unsubscribe,
} from "./socket";
import { messageCallbackType } from "@stomp/stompjs";

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
      __html: `html, body { height: 100%; background-color: rgba(0,0,0,0); }`,
    }}
  />
);

export default function WidgetWrapper({ children }: { children: ReactNode }) {
  const { settings, widgetId } = useLoaderData() as WidgetData;
  const navigate = useNavigate();

  console.log("enabled " + settings.enabled);

  useEffect(() => {
    if (!settings.enabled) {
      return;
    }
    setupCommandListener(widgetId, () => navigate(0));
    return () => {
      cleanupCommandListener(widgetId);
    };
  }, [widgetId, settings]);

  if (!settings.enabled) {
    return <></>;
  }

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
          publish: (topic: string, payload: any) => {
            publish(topic, payload);
          },
        }}
      >
        {children}
      </WidgetSettingsContext.Provider>
    </>
  );
}
