import { useContext } from "react";
import { FontContext } from "../../stores/FontStore";
import { log } from "../../logging";

export default function FontImport({ font }: { font: string }) {
  const fonts = useContext(FontContext);

  log.debug({ font: font }, "creating css rule for font");

  return (
    <>
      {font && (
        <style
          dangerouslySetInnerHTML={{
            __html: fonts.getImportCss(font),
          }}
        />
      )}
    </>
  );
}
