import { useContext } from "react";
import { FontContext } from "../../stores/FontStore";

export default function FontImport({ font }: { font: string }) {
  const fonts = useContext(FontContext);

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
