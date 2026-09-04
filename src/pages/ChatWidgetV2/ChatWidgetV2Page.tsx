import WidgetWrapper from "../../WidgetWrapper";
import { ChatWidgetV2 } from "./ChatWidgetV2";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { ChatWidgetSettings } from "../ChatWidget/ChatWidgetSettings";
import {
  forwardEmotesToCache,
  registerEmoteCacheWorker,
} from "../../emoteCacheWorker";
import { useEffect } from "react";

export default function ChatWidgetV2Page() {
  const { recipientId, settings } = useLoaderData() as WidgetData;

  useEffect(() => {
    console.log("Registering emote cache worker");
    registerEmoteCacheWorker().then(() => forwardEmotesToCache());
  }, [recipientId]);

  return (
    <WidgetWrapper>
      <ChatWidgetV2
        settings={Widget.configFromJson(settings) as ChatWidgetSettings}
      />
    </WidgetWrapper>
  );
}
