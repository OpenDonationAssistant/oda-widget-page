import { ReactNode } from "react";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorPicker } from "antd";

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
      <LabeledContainer displayName={this.displayName}>
        <ColorPicker
          value={this.value}
          showText
          onChange={(value) => {
            if (!this.widgetId) {
              return;
            }
            updateConfig(this.widgetId, this.name, value.toRgbString());
          }}
        />
    </LabeledContainer>
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
