import { observer } from "mobx-react-lite";
import { AdvancedTextProperty } from "./AdvancedTextProperty";
import { VariableStoreContext } from "../../../../stores/VariableStore";
import { useContext } from "react";
import FontImport from "../../../FontImport/FontImport";

export const AdvancedText = observer(
  ({ property }: { property: AdvancedTextProperty }) => {
    const variables = useContext(VariableStoreContext);

    return (
      <div
        style={{ ...property.css, ...{ zIndex: 2, opacity: 1 } }}
        className={property.className}
      >
        <FontImport font={property.value.family} />;
        {variables.processTemplate(property.text)}
      </div>
    );
  },
);
