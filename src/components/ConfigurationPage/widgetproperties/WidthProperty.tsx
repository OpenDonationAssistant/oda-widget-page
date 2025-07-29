import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import InputNumber from "../components/InputNumber";
import { Flex, Segmented } from "antd";

export class WidthProperty extends DefaultWidgetProperty<number> {
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
      displayName: displayName ?? "max-width",
    });
  }

  comp = observer(() => {
    return (
      <Flex vertical gap={9}>
        <LabeledContainer displayName={this.displayName}>
          <Segmented
            className="full-width"
            options={[
              {
                value: 0,
                label: "Растягивать",
              },
              {
                value: 1,
                label: "Зафиксировать",
              },
            ]}
            value={this.value > -1 ? 1 : 0}
            onChange={(checked) => {
              if (checked) {
                this.value = 100;
              } else {
                this.value = -1;
              }
            }}
          />
        </LabeledContainer>
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
        width: `${this.value}px`,
        overflowX: "hidden",
      };
    }
    return {};
  }

  markup(): ReactNode {
    return <this.comp />;
  }

  public copy(): WidthProperty {
    return new WidthProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
    });
  }
}
