import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Select } from "antd";
import { Trans } from "react-i18next";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";

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
      <LabeledContainer displayName={this.displayName}>
        <Select
          value={this.value}
          className="full-width"
          onChange={(e) => {
            if (!this.widgetId) {
              return;
            }
            updateConfig(this.widgetId, this.name, e);
          }}
          options={this.options.map((option) => {
            return {
              value: option,
              label: (
                <>
                  <Trans i18nKey={option} />
                </>
              ),
            };
          })}
        />
      </LabeledContainer>
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
