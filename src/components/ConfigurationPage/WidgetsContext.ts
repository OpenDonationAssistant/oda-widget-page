import { createContext } from "react";
import { AbstractWidgetSettings } from "./WidgetSettings";

export const WidgetsContext = createContext({
  config: new Map<string, AbstractWidgetSettings>(),
  setConfig: (newConfig: Map<string, AbstractWidgetSettings>) => {},
  updateConfig: (id: string, key: string, value) => {},
});
