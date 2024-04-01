import { ReactNode, useContext } from "react";
import { log } from "../../../logging";
import { WidgetsContext } from "../WidgetsContext";
import { DefaultWidgetProperty } from "./WidgetProperty";

export class NumberProperty extends DefaultWidgetProperty {
  constructor(
    widgetId: string,
    name: string,
    type: string,
    value: any,
    displayName: string,
    tab?: string | undefined,
  ) {
    super(widgetId, name, type, value, displayName, tab);
    log.debug({ property: this }, "Created SingleChoiceProperty");
  }

  copy() {
    return new NumberProperty(
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
        <input
          value={this.value}
          type="number"
          className="widget-settings-value"
          onChange={(e) => {
            if (!this.widgetId) {
              return;
            }
            updateConfig(this.widgetId, this.name, e.target.value);
          }}
        />
      </div>
    );
  }
}
