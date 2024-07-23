import { ReactNode } from "react";
import FontSelect from "../settings/FontSelect";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";

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
      <LabeledContainer displayName={this.displayName}>
        <FontSelect
          prop={this}
          className="full-width"
          onChange={(value: string) => {
            if (!this.widgetId) {
              return;
            }
            updateConfig(this.widgetId, this.name, value);
          }}
        />
      </LabeledContainer>
    );
  }
}
