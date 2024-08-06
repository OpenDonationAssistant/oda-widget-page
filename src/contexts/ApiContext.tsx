import { createContext } from "react";

export const ApiContext = createContext({
  listDonaters: (period: string) => Promise.resolve([]) as Promise<any>,
});
