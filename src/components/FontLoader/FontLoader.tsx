import React, { useEffect, useState } from "react";
import FontImport from "../FontImport/FontImport";
import { IFontProvider } from "./IFontLoader";

export default function FontLoader({
  fontProvider,
}: {
  fontProvider: IFontProvider;
}) {
  const [fonts, setFonts] = useState<string[]>([]);

  useEffect(() => {
    fontProvider.addFontLoader({
      addFont: (font) => {
        setFonts((oldFonts) => {
          return Array.from(new Set(oldFonts).add(font));
        });
      },
    });
  }, [fontProvider]);

  return (
    <>
      {fonts.map((font) => (
        <FontImport key={font} font={font} />
      ))}
    </>
  );
}
