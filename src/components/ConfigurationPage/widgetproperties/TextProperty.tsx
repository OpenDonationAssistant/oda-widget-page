import { ReactNode, useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import { DefaultWidgetProperty } from "./WidgetProperty";

export class TextProperty extends DefaultWidgetProperty {
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
    return new TextProperty(
      this.widgetId,
      this.name,
      this.type,
      this.value,
      this.displayName,
      this.tab,
    );
  }

  markup(): ReactNode {
    const { updateConfig } = useContext(WidgetsContext);
    return (
      <div key={this.name} className="widget-settings-item">
        <label
          htmlFor={`${this.widgetId}_${this.name}`}
          className="widget-settings-name"
        >
          {this.displayName}
        </label>
        <div className="textarea-container">
          <textarea
            style={{ width: "50%" }}
            className="widget-settings-value"
            value={this.value}
            onChange={(e) =>
              updateConfig(this.widgetId, this.name, e.target.value)
            }
          />
        </div>
      </div>
    );
  }
}
