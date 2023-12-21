export default function FontImport({ font }: { font: string }) {
  return (
    <>
      {font && (
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=${font.replace(
              " ",
              "+",
            )}&display=swap');`,
          }}
        />
      )}
    </>
  );
}
