import { ReactNode, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "./types/WidgetData";
import { cleanupCommandListener, setupCommandListener } from "./socket";
import { FontContext, FontStore } from "./stores/FontStore";
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

  return (
    <>
      {overflowHiddenForRootElement}
      {fullHeight}
      <FontContext.Provider value={new FontStore()}>
        {children}
      </FontContext.Provider>
    </>
  );
}
