import { createContext } from "react";

export const WidgetsContext = createContext({
  config: new Map(),
  setConfig: (newConfig) => {},
  updateConfig: (id: string, key: string, value) => {},
});
