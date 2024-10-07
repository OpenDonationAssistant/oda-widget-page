import { ReactNode } from "react";
import FontSelect from "../settings/FontSelect";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { DefaultWidgetProperty } from "./WidgetProperty";

export class FontProperty extends DefaultWidgetProperty<string> {

  markup(): ReactNode {
    return (
      <LabeledContainer displayName={this.displayName}>
        <FontSelect
          prop={this}
          className="full-width"
          onChange={(value: string) => {
            this.value = value;
          }}
        />
      </LabeledContainer>
    );
  }
}
