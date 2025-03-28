import {
  DefaultApiFactory as FontApiFactory,
  FontDto,
} from "@opendonationassistant/oda-font-service-client";
import { createContext } from "react";
import { log } from "../logging";

export class FontStore {
  private _fonts: FontDto[] = [];

  constructor() {
    this.client()
      .listFonts()
      .then((response) => {
        this._fonts = response.data;
      });
  }

  private client() {
    return FontApiFactory(undefined, process.env.REACT_APP_FONT_API_ENDPOINT);
  }

  public list(): string[] {
    return this._fonts.map((font) => font.name);
  }

  public getImportCss(name: string) {
    const font = this._fonts.find((font) => font.name === name);
    if (font?.type === "google") {
      return `@font-face {
                font-family: '${font.name}';
                font-style: normal;
                font-display: swap;
                font-weight: 400;
                src: url(https://cdn.jsdelivr.net/fontsource/fonts/${font.name}@latest/latin-400-normal.woff2) format('woff2'), url(https://cdn.jsdelivr.net/fontsource/fonts/${font.name}@latest/latin-400-normal.woff) format('woff');
                unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
              }

              @font-face {
                font-family: '${font.name}';
                font-style: normal;
                font-display: swap;
                font-weight: 400;
                src: url(https://cdn.jsdelivr.net/fontsource/fonts/${font.name}@latest/cyrillic-400-normal.woff2) format('woff2'), url(https://cdn.jsdelivr.net/fontsource/fonts/${font.name}@latest/cyrillic-400-normal.woff) format('woff');
                unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
              }`;
    }
    if (font?.type === "stored") {
      if (font.sources) {
        const sources = font.sources;
        return (
          Object.keys(sources)
            .map(
              (type) => `@font-face {
            font-family: '${font.name}';
            src: url(${sources[type]}) format('${type}');
          }`,
            )
            .at(0) ?? ""
        );
      }
    }
    return "";
  }
}

export const FontContext = createContext(new FontStore());
