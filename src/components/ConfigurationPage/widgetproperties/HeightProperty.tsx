import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import InputNumber from "../components/InputNumber";
import { Flex, Segmented, Switch } from "antd";
import classes from "./WidthProperty.module.css";
import { LightLabeledSwitchComponent } from "../../LabeledSwitch/LabeledSwitchComponent";

export class HeightProperty extends DefaultWidgetProperty<number> {
  constructor({
    name,
    value,
    displayName,
  }: {
    name: string;
    value?: number;
    displayName?: string;
  }) {
    super({
      name: name,
      value: value === undefined || value === null || value === 0 ? -1 : value,
      displayName: displayName ?? "max-height",
    });
  }

  copy() {
    return new HeightProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
    });
  }

  comp = observer(() => {
    return (
      <Flex vertical gap={9}>
        <LightLabeledSwitchComponent
          label={this.displayName}
          value={this.value > -1}
          onChange={(checked) => {
            if (checked) {
              this.value = 100;
            } else {
              this.value = -1;
            }
          }}
        />
        {this.value > -1 && (
          <InputNumber
            value={this.value}
            addon="px"
            onChange={(newValue) => {
              if (newValue === null || newValue === undefined) {
                return;
              }
              this.value = newValue;
            }}
          />
        )}
      </Flex>
    );
  });

  public calcCss(): CSSProperties {
    if (this.value > 0) {
      return {
        height: `${this.value}px`,
        minHeight: `${this.value}px`,
        overflowY: "hidden",
      };
    }
    return {};
  }

  markup(): ReactNode {
    return <this.comp />;
  }
}
