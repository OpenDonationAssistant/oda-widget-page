import { useContext } from "react";
import FontImport from "../../../../components/FontImport/FontImport";
import { AlertStateContext } from "../../AlertState";

export default function FontLoader({}) {
  const state = useContext(AlertStateContext);

  return (
    <>
      {state.fonts.map((font) => (
        <FontImport key={font} font={font} />
      ))}
    </>
  );

}
