import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { InputNumber } from 'antd';
import { Trans } from "react-i18next";
import classes from "./NumberProperty.module.css";

export class NumberProperty extends DefaultWidgetProperty {

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
        <label className={`${classes.name}`}>
          <Trans i18nKey={this.displayName}/>
        </label>
        <InputNumber
          value={this.value}
          size="small"
          className={`${classes.value}`}
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
