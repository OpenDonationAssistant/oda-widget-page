import { useContext } from "react";
import { FontContext } from "../../stores/FontStore";
import { log } from "../../logging";

export default function FontImport({ font }: { font: string }) {
  const fonts = useContext(FontContext);

  log.debug({font: font}, "creating css rule for font");

  return (
    <>
      {font && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: '${font}';
                font-style: normal;
                font-display: swap;
                font-weight: 400;
                src: url(https://cdn.jsdelivr.net/fontsource/fonts/${font}@latest/latin-400-normal.woff2) format('woff2'), url(https://cdn.jsdelivr.net/fontsource/fonts/${font}@latest/latin-400-normal.woff) format('woff');
                unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
              }

              @font-face {
                font-family: '${font}';
                font-style: normal;
                font-display: swap;
                font-weight: 400;
                src: url(https://cdn.jsdelivr.net/fontsource/fonts/${font}@latest/cyrillic-400-normal.woff2) format('woff2'), url(https://cdn.jsdelivr.net/fontsource/fonts/${font}@latest/cyrillic-400-normal.woff) format('woff');
                unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
              }`,
          }}
        />
      )}
    </>
  );
}
