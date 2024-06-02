import { ReactNode } from "react";
import ColorPicker from "../settings/ColorPicker";

export class ColorProperty {
  widgetId: string | null;
  name: string;
  type: string;
  value: any;
  displayName: string;
  tab?: string | undefined;

  constructor(
    widgetId: string | null,
    name: string,
    type: string,
    value: any,
    displayName: string,
    tab?: string | undefined,
  ) {
    this.widgetId = widgetId;
    this.name = name;
    this.type = type;
    this.displayName = displayName;
    this.value = value;
    this.tab = tab;
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
        <ColorPicker
          value={this.value}
          onChange={(value: string) => {
            if (!this.widgetId) {
              return;
            }
            updateConfig(this.widgetId, this.name, value);
          }}
        />
      </div>
    );
  }
  copy() {
    return new ColorProperty(
      this.widgetId,
      this.name,
      this.type,
      this.value,
      this.displayName,
      this.tab,
    );
  }
}
