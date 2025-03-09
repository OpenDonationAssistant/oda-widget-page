import FontImport from "../../../../components/FontImport/FontImport";
import { AlertState } from "../../AlertState";
import { observer } from "mobx-react-lite";

export const FontLoader = observer(({ state }: { state: AlertState }) => {
  return (
    <>
      {state.fonts.map((font) => (
        <FontImport key={font} font={font} />
      ))}
    </>
  );
});
