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
    console.log("registering service worker");
    if ("serviceWorker" in navigator) {
      const swUrl = `http://localhost:3001/logger-worker.js`;
      try {
        navigator.serviceWorker
          .register(swUrl, {
            scope: "/",
          })
          .then((reg) => {
            console.log("SW registered:", reg);
            // optional: listen for updates
            reg.addEventListener("updatefound", () => {
              const nw = reg.installing;
              nw?.addEventListener("statechange", () =>
                console.log("SW state:", nw.state),
              );
            });
          });
      } catch (err) {
        console.error("SW registration failed:", err);
      }
    } else {
      console.log("Service workers are not supported in this browser.");
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
        <FontContext.Provider value={new FontStore()}>
          {children}
        </FontContext.Provider>
      </WidgetSettingsContext.Provider>
    </>
  );
}
