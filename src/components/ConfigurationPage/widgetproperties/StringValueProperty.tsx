import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";

export class StringValueProperty extends DefaultWidgetProperty {
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
    return new StringValueProperty(
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
      <div key={this.name} className="widget-settings-item">
        <label
          htmlFor={`${this.widgetId}_${this.name}`}
          className="widget-settings-name"
        >
          {this.displayName}
        </label>
        <input
          id={`${this.widgetId}_${this.name}`}
          value={this.value}
          className="widget-settings-value"
          onChange={(e) =>
            updateConfig(this.widgetId, this.name, e.target.value)
          }
        />
      </div>
    );
  }
}
