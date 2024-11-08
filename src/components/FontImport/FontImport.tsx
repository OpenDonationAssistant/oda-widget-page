import { log } from "../../logging";

export default function FontImport({ font }: { font: string }) {
  log.debug({ font: font },"creating font import");
  return (
    <>
      {font && (
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=${font.replaceAll(
              " ",
              "+",
            )}&display=swap');`,
          }}
        />
      )}
    </>
  );
}
