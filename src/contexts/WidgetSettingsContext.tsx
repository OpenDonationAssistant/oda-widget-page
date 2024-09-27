import { createContext } from "react";
import { AbstractWidgetSettings } from "../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";

export const WidgetSettingsContext = createContext({
  widgetId: "",
  settings: {
    config: new AbstractWidgetSettings({
      properties: [],
      sections: [],
      notifier: { notify: () => {} },
    }),
  },
  subscribe: (
    topic: string,
    onMessage: (message: { ack: () => void; body: string }) => void,
  ) => {},
  unsubscribe: (topic: string) => {},
  publish: (topic: string, payload: any) => {},
});
