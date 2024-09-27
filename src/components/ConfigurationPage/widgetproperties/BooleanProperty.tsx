import { ReactNode } from "react";
import BooleanPropertyInput from "../settings/properties/BooleanPropertyInput";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";

export class BooleanProperty extends DefaultWidgetProperty {
  constructor(
    widgetId: string,
    name: string,
    type: string,
    value: any,
    displayName: string,
    tab?: string | undefined,
  ) {
    super(widgetId, name, type, value, displayName, tab);
  }

  copy() {
    return new BooleanProperty(
      this.widgetId,
      this.name,
      this.type,
      this.value,
      this.displayName,
      this.tab,
    );
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <>
        <LabeledContainer displayName={this.displayName}>
          <BooleanPropertyInput
            prop={this}
            onChange={() => {
              if (this.widgetId) {
                updateConfig(this.widgetId, this.name, !this.value);
              }
            }}
          />
        </LabeledContainer>
      </>
    );
  }
}
