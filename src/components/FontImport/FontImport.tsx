import { useContext, useEffect, useState } from "react";
import { FontContext } from "../../stores/FontStore";

export default function FontImport({ font }: { font: string }) {
  const fonts = useContext(FontContext);

  const [css, setCss] = useState<string>("");

  useEffect(() => {
    fonts.getImportCss(font).then((loaded) => setCss(loaded));
  }, [font]);

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
