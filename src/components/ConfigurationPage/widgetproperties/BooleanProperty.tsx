import { ReactNode } from "react";
import BooleanPropertyInput from "../settings/properties/BooleanPropertyInput";
import { DefaultWidgetProperty } from "./WidgetProperty";

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
        <div key={this.name} className="widget-settings-item">
          <label
            htmlFor={`${this.widgetId}_${this.name}`}
            className="widget-settings-name"
          >
            {this.displayName}
          </label>
          <BooleanPropertyInput
            prop={this}
            onChange={() => {
              if (this.widgetId) {
                updateConfig(this.widgetId, this.name, !this.value);
              }
            }}
          />
        </div>
      </>
    );
  }
}
