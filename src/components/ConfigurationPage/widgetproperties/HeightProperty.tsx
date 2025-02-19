import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import InputNumber from "../components/InputNumber";
import { Flex, Switch } from "antd";
import classes from "./WidthProperty.module.css";

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
      value: value ?? -1,
      displayName: displayName ?? "max-height",
    });
  }

  comp = observer(() => {
    return (
      <>
        <LabeledContainer displayName={this.displayName}>
          <Flex className="full-width" justify="flex-end">
            {this.value > -1 && (
              <div className={`${classes.widthholder}`}>
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
              </div>
            )}
            <Switch
              value={this.value > -1}
              onChange={(checked) => {
                if (checked) {
                  this.value = 100;
                } else {
                  this.value = -1;
                }
              }}
            />
            <div className={`${classes.label}`}>Зафиксировать высоту</div>
          </Flex>
        </LabeledContainer>
      </>
    );
  });

  public calcCss(): CSSProperties {
    if (this.value > 0) {
      return {
        height: `${this.value}px`,
        overflowY: "hidden",
      };
    }
    return { };
  }

  markup(): ReactNode {
    return <this.comp />;
  }
}
