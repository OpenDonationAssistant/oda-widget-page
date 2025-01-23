import { DefaultApiFactory as FontApiFactory } from "@opendonationassistant/oda-font-service-client";
import { createContext } from "react";

export class FontStore {
  private _list: string[] = [];

  constructor() {
    this.client()
      .listFonts()
      .then((response) => {
        return response.data.map((font) => font.name);
      })
      .then((list) => {
        this._list = list;
      });
  }

  private client() {
    return FontApiFactory(undefined, process.env.REACT_APP_FONT_API_ENDPOINT);
  }

  public list(): string[] {
    return this._list;
  }
}

export const FontContext = createContext(new FontStore());
