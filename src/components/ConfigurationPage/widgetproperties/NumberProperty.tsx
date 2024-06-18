import { ReactNode } from "react";
import { log } from "../../../logging";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { InputNumber } from 'antd';
import { Trans } from "react-i18next";

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

  markup(updateConfig: Function): ReactNode {
    return (
      <div key={this.name} className="widget-settings-item">
        <label
          htmlFor={`${this.widgetId}_${this.name}`}
          className="widget-settings-name"
        >
          <Trans i18nKey={this.displayName}/>
        </label>
        <InputNumber
          value={this.value}
          size="small"
          className="widget-settings-value"
          onChange={(e) => {
            if (!this.widgetId) {
              return;
            }
            updateConfig(this.widgetId, this.name, e);
          }}
        />
      </div>
    );
  }
}
