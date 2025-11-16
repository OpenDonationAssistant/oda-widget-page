import { useContext, useEffect, useState } from "react";
import { FontContext } from "../../stores/FontStore";
import { log } from "../../logging";

export default function FontImport({ font }: { font: string }) {
  const fonts = useContext(FontContext);

  const [css, setCss] = useState<string>("");

  useEffect(() => {
    fonts.getImportCss(font).then((loaded) => {
      if (loaded) {
        setCss(loaded);
        log.debug({ css: css }, "Loaded css");
      }
    });
  }, [font, fonts, css]);

  return (
    <>
      {font && (
        <style
          dangerouslySetInnerHTML={{
            __html: css,
          }}
        />
      )}
    </>
  );
}
