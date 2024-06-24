import { ReactNode } from "react";
import FontSelect from "../settings/FontSelect";
import { Trans } from "react-i18next";
import classes from "./FontProperty.module.css";

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

  markup(updateConfig: Function): ReactNode {
    return (
      <div key={this.name} className="widget-settings-item">
        <label className={`${classes.label}`}>
          <Trans i18nKey={this.displayName}/>
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
