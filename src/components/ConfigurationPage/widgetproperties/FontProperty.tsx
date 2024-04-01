import { ReactNode, useContext } from "react";
import { log } from "../../../logging";
import FontSelect from "../settings/FontSelect";
import { WidgetsContext } from "../WidgetsContext";

export class FontProperty {
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
    log.debug({ property: this }, "Created SingleChoiceProperty");
  }

  copy() {
    return new FontProperty(
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
        <FontSelect
          prop={this}
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
}
