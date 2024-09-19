import { createContext } from "react";
import { AbstractWidgetSettings } from "../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { messageCallbackType } from "@stomp/stompjs";

export const WidgetSettingsContext = createContext({
  widgetId: "",
  settings: { config: new AbstractWidgetSettings("", [], [], new Map()) },
  subscribe: (
    topic: string,
    onMessage: (message: { ack: () => void; body: string }) => void,
  ) => {},
  unsubscribe: (topic: string) => {},
  publish: (topic: string, payload: any) => {},
});
