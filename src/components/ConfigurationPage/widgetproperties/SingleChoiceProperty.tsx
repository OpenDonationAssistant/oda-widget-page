import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";

export class SingleChoiceProperty extends DefaultWidgetProperty {
  options: string[];

  constructor(
    widgetId: string,
    name: string,
    type: string,
    value: any,
    displayName: string,
    options?: string[] | undefined,
    tab?: string | undefined,
  ) {
    super(widgetId, name, type, value, displayName, tab);
    this.options = options ?? [];
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <div key={this.name} className="widget-settings-item">
        <label className="widget-settings-name">{this.displayName}</label>
        <select
          value={this.value}
          className="widget-settings-value select"
          onChange={(e) => {
            if (!this.widgetId) {
              return;
            }
            updateConfig(this.widgetId, this.name, e.target.value);
          }}
        >
          {this.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  copy(): SingleChoiceProperty {
    return new SingleChoiceProperty(
      this.widgetId,
      this.name,
      this.type,
      this.value,
      this.displayName,
      this.options,
      this.tab,
    );
  }
}
