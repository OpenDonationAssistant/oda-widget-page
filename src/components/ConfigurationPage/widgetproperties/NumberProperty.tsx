import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { InputNumber } from "antd";
import { Trans } from "react-i18next";
import classes from "./NumberProperty.module.css";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";

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
      <LabeledContainer displayName={this.displayName}>
        <InputNumber
          value={this.value}
          className={`${classes.value} full-width`}
          onChange={(e) => {
            if (!this.widgetId) {
              return;
            }
            updateConfig(this.widgetId, this.name, e);
          }}
        />
      </LabeledContainer>
    );
  }
}
