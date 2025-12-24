import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import InputNumber from "../components/InputNumber";
import { Flex, Segmented } from "antd";
import { LightLabeledSwitchComponent } from "../../LabeledSwitch/LabeledSwitchComponent";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";

export interface HeightPropertyValue {
  type: "min" | "max" | "fixed";
  value: number;
}

export const HeightPropertyComponent = observer(
  ({ property }: { property: HeightPropertyValue }) => {
    return (
      <LabeledContainer displayName="Высота">
        <Flex vertical className="full-width" gap={9}>
          <Segmented
            className="full-width"
            options={[
              {
                label: "Минимальная",
                value: "min",
              },
              {
                label: "Фиксированная",
                value: "fixed",
              },
              {
                label: "Максимальная",
                value: "max",
              },
            ]}
            value={property.type}
            onChange={(value) => {
              property.type = value as "min" | "max" | "fixed";
            }}
          />
          {property.type === "fixed" && (
            <InputNumber
              value={property.value}
              addon="px"
              onChange={(newValue) => {
                if (newValue === null || newValue === undefined) {
                  return;
                }
                property.value = newValue;
              }}
            />
          )}
        </Flex>
      </LabeledContainer>
    );
  },
);

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
