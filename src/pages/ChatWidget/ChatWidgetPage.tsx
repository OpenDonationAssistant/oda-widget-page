import WidgetWrapper from "../../WidgetWrapper";
import { ChatWidget } from "./ChatWidget";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { ChatWidgetSettings } from "./ChatWidgetSettings";
import { DefaultChatWidgetStore } from "./ChatWidgetStore";

export default function ChatWidgetPage() {
  const navigate = useNavigate();
  const { recipientId, settings, conf, widgetId } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(settings) as ChatWidgetSettings;
  const store = new DefaultChatWidgetStore({});

  return (
    <WidgetWrapper>
      <ChatWidget
        settings={Widget.configFromJson(settings) as ChatWidgetSettings}
        store={store}
      />
    </WidgetWrapper>
  );
}
