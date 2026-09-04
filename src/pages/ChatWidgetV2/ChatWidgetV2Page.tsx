import WidgetWrapper from "../../WidgetWrapper";
import { ChatWidgetV2 } from "./ChatWidgetV2";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { ChatWidgetSettings } from "../ChatWidget/ChatWidgetSettings";
import { forwardEmotesToCache, registerEmoteCacheWorker } from "../../emoteCacheWorker";

export default function ChatWidgetV2Page() {
  const { settings } = useLoaderData() as WidgetData;

  registerEmoteCacheWorker();
  forwardEmotesToCache();

  return (
    <WidgetWrapper>
      <ChatWidgetV2
        settings={Widget.configFromJson(settings) as ChatWidgetSettings}
      />
    </WidgetWrapper>
  );
}

