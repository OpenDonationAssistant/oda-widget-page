import { createContext, useContext } from "react";

export const ElementEditingContext = createContext<boolean>(false);

export function useElementEditing(): boolean {
  return useContext(ElementEditingContext);
}
