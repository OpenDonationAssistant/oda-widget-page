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
import { FontContext, FontStore } from "./stores/FontStore";
import {
  DefaultVariableStore,
  VariableStoreContext,
} from "./stores/VariableStore";
import { getWorkerPort } from "./worker";

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

  useEffect(() => {
    console.log("connecting to shared worker");
    try {
      getWorkerPort();
    } catch (err) {
      console.error("SharedWorker connection failed:", err);
    }
  }, [widgetId]);

  useEffect(() => {
    if (!settings.enabled) {
      return;
    }
    setupCommandListener(widgetId, () => navigate(0));
    return () => {
      cleanupCommandListener(widgetId);
    };
  }, [widgetId, settings, navigate]);

  if (!settings.enabled) {
    return <></>;
  }

  const variables = new DefaultVariableStore();

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
        <VariableStoreContext.Provider value={variables}>
          <FontContext.Provider value={new FontStore()}>
            {children}
          </FontContext.Provider>
        </VariableStoreContext.Provider>
      </WidgetSettingsContext.Provider>
    </>
  );
}
